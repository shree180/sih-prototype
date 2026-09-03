-- ============================================================================
-- 0003_seed.sql — demo jurisdiction + sample reports
-- Run AFTER creating a demo citizen + authority user in Supabase Auth,
-- then set the emails below and run. Safe to re-run (idempotent via ON CONFLICT).
-- ============================================================================

-- Demo jurisdiction (a small area around a city center; replace coords as needed)
insert into public.jurisdictions (id, name, type, geometry)
values (
  '11111111-1111-1111-1111-111111111111',
  'Demo City',
  'city',
  st_setsrid(st_geomfromtext(
    'MULTIPOLYGON(((' ||
    '72.80 18.90, 72.95 18.90, 72.95 19.05, 72.80 19.05, 72.80 18.90' ||
    ')))'), 4326)::geography
)
on conflict (id) do nothing;

-- Sample reports are intentionally tied to a real auth user.
-- Replace the emails with users you created in the Supabase dashboard.
do $$
declare
  v_citizen uuid;
  v_report  uuid;
begin
  select id into v_citizen from auth.users where email = 'demo-citizen@example.com' limit 1;
  if v_citizen is null then
    raise notice 'Skipping seed: create demo-citizen@example.com in Auth first.';
    return;
  end if;

  insert into public.reports (
    id, reporter_id, disaster_type, asset_type, description,
    observed_severity, ai_severity, ai_confidence, final_severity,
    priority_score, verification_status, operational_status,
    affected_people, infrastructure_impact, accessibility_blocked,
    location, location_accuracy_m, location_source, submitted_at
  )
  values (
    '22222222-2222-2222-2222-222222222222',
    v_citizen, 'flood', 'building',
    'Water entering ground floor, vehicles stranded on street.',
    'severe', 'severe', 0.82, 'severe',
    public.compute_priority('severe', 0.82, 12, true, true, now()),
    'needs_review', 'new',
    12, true, true,
    st_setsrid(st_makepoint(72.8777, 18.9667), 4326)::geography,
    25, 'gps', now() - interval '2 hours'
  )
  on conflict (id) do nothing;

  insert into public.ai_assessments (
    report_id, provider, model_name, model_version,
    predicted_category, predicted_severity, confidence,
    indicators, explanation, status, processing_time_ms
  )
  values (
    '22222222-2222-2222-2222-222222222222',
    'demo', 'vision-llm', '1.0',
    'flood', 'severe', 0.82,
    '["water intrusion","debris","stranded vehicles"]'::jsonb,
    'Visible flooding at street level with stranded vehicles indicating substantial impact.',
    'needs_human_review', 1200
  )
  on conflict do nothing;
end $$;
