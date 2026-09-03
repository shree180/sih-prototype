-- ============================================================================
-- 0004_rpc.sql — read helpers that expose lat/lng from geography
-- RLS still applies (function runs as caller, not SECURITY DEFINER).
-- ============================================================================

create or replace function public.reports_list()
returns table (
  id uuid,
  reporter_id uuid,
  disaster_type text,
  asset_type text,
  description text,
  ai_severity text,
  ai_confidence numeric,
  final_severity text,
  priority_score integer,
  verification_status text,
  operational_status text,
  affected_people integer,
  infrastructure_impact boolean,
  accessibility_blocked boolean,
  lat double precision,
  lng double precision,
  submitted_at timestamptz,
  updated_at timestamptz
)
language sql
stable
as $$
  select
    r.id, r.reporter_id, r.disaster_type, r.asset_type, r.description,
    r.ai_severity, r.ai_confidence, r.final_severity, r.priority_score,
    r.verification_status, r.operational_status, r.affected_people,
    r.infrastructure_impact, r.accessibility_blocked,
    case when r.location is not null
      then st_y(r.location::geometry) else null end as lat,
    case when r.location is not null
      then st_x(r.location::geometry) else null end as lng,
    r.submitted_at, r.updated_at
  from public.reports r;
$$;

grant execute on function public.reports_list() to authenticated;
