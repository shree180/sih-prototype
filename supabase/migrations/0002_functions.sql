-- ============================================================================
-- 0002_functions.sql — business logic helpers (priority, geo, duplicates)
-- ============================================================================

-- Compute an explainable operational priority score (0-100).
-- Weights are configuration values, not scientific truth (see spec FR-011).
create or replace function public.compute_priority(
  p_severity text,
  p_confidence numeric,
  p_affected_people integer,
  p_infrastructure boolean,
  p_accessibility boolean,
  p_submitted_at timestamptz default now()
)
returns integer
language plpgsql
immutable
as $$
declare
  v_score integer := 0;
  v_sev integer := 0;
  v_conf integer := 0;
  v_people integer := 0;
  v_infra integer := 0;
  v_access integer := 0;
  v_recency integer := 0;
begin
  v_sev := case p_severity
    when 'critical' then 40
    when 'severe'   then 32
    when 'moderate' then 22
    when 'minor'    then 12
    else 0 end;

  v_conf := coalesce(round(coalesce(p_confidence, 0) * 15), 0)::integer;

  v_people := least(coalesce(p_affected_people, 0), 100) / 7; -- cap ~15
  v_people := least(v_people, 15);

  v_infra := case when p_infrastructure then 10 else 0 end;
  v_access := case when p_accessibility then 10 else 0 end;

  -- recency: full 10 if <6h old, linear decay to 0 over 72h
  v_recency := greatest(0,
    least(10, 10 - (extract(epoch from (now() - p_submitted_at)) / 3600.0 - 6) / 6.6));

  v_score := v_sev + v_conf + v_people + v_infra + v_access + v_recency;
  return least(100, greatest(0, v_score));
end;
$$;

-- Nearby reports (radius in meters) — server-side geospatial query.
create or replace function public.nearby_reports(
  p_lon double precision,
  p_lat double precision,
  p_radius_m double precision default 5000,
  p_limit integer default 50
)
returns setof public.reports
language sql
stable
security definer
set search_path = public
as $$
  select r.*
  from public.reports r
  where r.location is not null
    and st_dwithin(r.location, st_makepoint(p_lon, p_lat)::geography, p_radius_m)
  order by st_distance(r.location, st_makepoint(p_lon, p_lat)::geography) asc
  limit p_limit;
$$;

-- Reports within a bounding box (for map viewport queries).
create or replace function public.reports_in_bbox(
  p_min_lon double precision,
  p_min_lat double precision,
  p_max_lon double precision,
  p_max_lat double precision,
  p_limit integer default 500
)
returns setof public.reports
language sql
stable
security definer
set search_path = public
as $$
  select r.*
  from public.reports r
  where r.location is not null
    and r.location && st_makeenvelope(p_min_lon, p_min_lat, p_max_lon, p_max_lat, 4326)
  limit p_limit;
$$;

-- Potential duplicate detection (image similarity + proximity + time).
-- Returns reports that look like duplicates of the given report.
create or replace function public.potential_duplicates(
  p_report_id uuid,
  p_similarity_threshold numeric default 0.9,
  p_distance_m double precision default 100,
  p_hours integer default 6
)
returns table (dup_report_id uuid, distance_m double precision, hours_diff numeric)
language sql
stable
security definer
set search_path = public
as $$
  select r2.id as dup_report_id,
         st_distance(r1.location, r2.location) as distance_m,
         extract(epoch from (r2.submitted_at - r1.submitted_at)) / 3600.0 as hours_diff
  from public.reports r1
  join public.reports r2 on r2.id <> r1.id
  join public.report_media m1 on m1.report_id = r1.id
  join public.report_media m2 on m2.report_id = r2.id
  where r1.id = p_report_id
    and r2.location is not null and r1.location is not null
    and m1.perceptual_hash is not null and m2.perceptual_hash is not null
    and (m1.perceptual_hash % m2.perceptual_hash) < (1 - p_similarity_threshold) * 64
    and st_distance(r1.location, r2.location) < p_distance_m
    and abs(extract(epoch from (r2.submitted_at - r1.submitted_at)) / 3600.0) < p_hours;
$$;
