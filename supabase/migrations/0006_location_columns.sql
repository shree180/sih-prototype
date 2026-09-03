-- Preserve fast UI projections while PostGIS remains the source of truth for spatial queries.
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION;

UPDATE public.reports
SET location_lat = ST_Y(location::geometry),
    location_lng = ST_X(location::geometry)
WHERE location IS NOT NULL
  AND (location_lat IS NULL OR location_lng IS NULL);
