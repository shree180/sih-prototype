# Crowdsourced Disaster Damage Assessment System — SIH DRM04

From scattered citizen reports to a privacy-conscious, AI-assisted disaster intelligence map.

> **The AI assists triage. A human makes the final operational decision.**

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables-reference)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema-diagram)
- [Contributing](#contributing-guide)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DRM04 System Architecture                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────────┐     ┌─────────────────────┐    │
│  │   Citizen    │     │   Next.js Web    │     │   Supabase Stack    │    │
│  │   Portal     │◄────│   (Port 3000)    │◄───►│  ┌───────────────┐  │    │
│  └──────────────┘     └────────┬─────────┘     │  │ Postgres      │  │    │
│                                │               │  │ + PostGIS     │  │    │
│  ┌──────────────┐              │               │  ├───────────────┤  │    │
│  │  Authority   │◄─────────────┤               │  │ Auth (RLS)    │  │    │
│  │   Portal     │              │               │  ├───────────────┤  │    │
│  └──────────────┘              │               │  │ Storage       │  │    │
│                                │               │  │ (S3-compat)   │  │    │
│                                │               │  └───────────────┘  │    │
│                                │               └─────────┬───────────┘    │
│                                │                             │              │
│                                ▼                             ▼              │
│                       ┌──────────────────┐     ┌─────────────────────┐    │
│                       │   FastAPI AI     │     │   External AI       │    │
│                       │   (Port 8000)    │────►│   Providers         │    │
│                       └────────┬─────────┘     │  (OpenAI, Gemini,   │    │
│                                │               │   Demo fallback)    │    │
│                                │               └─────────────────────┘    │
│                                ▼                                            │
│                       ┌──────────────────┐                                │
│                       │   Nginx Proxy    │                                │
│                       │   (Port 80/443)  │                                │
│                       └──────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Three Deployable Units

| Component | Technology | Port | Description |
|-----------|------------|------|-------------|
| **Web App** | Next.js 14 (App Router, TypeScript, Tailwind) | 3000 | Citizen & Authority portals, server actions |
| **AI Service** | FastAPI (Python 3.12) | 8000 | `/assess` (structured severity), `/redact` (face blur) |
| **Database** | Supabase (PostgreSQL 16 + PostGIS) | 5432 | Auth, RLS, Storage, realtime, RPC functions |

---

## Quick Start

### Prerequisites

- Docker & Docker Compose (v2+)
- Node.js 20+ (for manual web development)
- Python 3.12+ (for manual AI service development)
- Supabase CLI (optional, for local Supabase)

### 1. Clone & Configure

```bash
git clone <repository-url>
cd DRDM04

# Copy environment examples
cp .env.example .env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/ai/.env.example apps/ai/.env
```

### 2. Start with Docker Compose (Recommended)

```bash
docker compose up -d --build
```

Services available at:
- **Web App**: http://localhost:3000
- **AI Service**: http://localhost:8000
- **AI Health**: http://localhost:8000/health
- **PostgreSQL**: localhost:5432 (user: drm04, pass: drm04, db: drm04)

### 3. Initialize Database

```bash
# Apply migrations (in order)
docker compose exec postgres psql -U drm04 -d drm04 -f /docker-entrypoint-initdb.d/00_init.sql

# Or run all migration files
for f in supabase/migrations/*.sql; do
  docker compose exec postgres psql -U drm04 -d drm04 -f "/docker-entrypoint-initdb.d/$(basename $f)"
done
```

### 4. Seed Demo Data

```bash
cd apps/web
SUPABASE_URL=http://localhost:3000 \
SUPABASE_SERVICE_ROLE_KEY=local-service-key \
node ../../scripts/seed_demo.mjs
```

### 5. Validate Setup

```bash
cd apps/web
node ../../scripts/first-run.mjs
```

---

## Local Development

### Option A: Docker Compose (Full Stack)

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f web
docker compose logs -f ai

# Rebuild after changes
docker compose up -d --build web
docker compose up -d --build ai

# Stop
docker compose down

# Stop with volumes (reset DB)
docker compose down -v
```

### Option B: Manual Development (Faster Iteration)

#### Web App

```bash
cd apps/web
npm install
npm run dev          # Starts on http://localhost:3000
npm run lint
npm run typecheck
npm run build        # Production build test
```

#### AI Service

```bash
cd apps/ai
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Set AI_PROVIDER=demo for no API key needed
uvicorn app.main:app --reload --port 8000
```

#### Database Only

```bash
docker compose up -d postgres
# Connect: postgresql://drm04:drm04@localhost:5432/drm04
```

### Environment Files

| File | Purpose |
|------|---------|
| `.env.example` | Root template (copy to `.env.local`) |
| `apps/web/.env.example` | Web-specific variables |
| `apps/ai/.env.example` | AI service variables |

---

## Production Deployment

### Overview

Three deployment targets supported:

| Target | Use Case | Complexity |
|--------|----------|------------|
| **Docker Compose** | Single VM, small scale | Low |
| **Kubernetes** | Production, auto-scaling, HA | Medium |
| **Vercel + Railway/Render** | Serverless web, managed services | Low |

---

### 1. Docker Compose Production

#### Production docker-compose.yml

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: drm04-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/cache:/var/cache/nginx
    depends_on:
      - web
      - ai
    restart: unless-stopped
    networks:
      - drm04-network

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: drm04-web
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - AI_SERVICE_URL=http://ai:8000
      - AI_SERVICE_KEY=${AI_SERVICE_KEY}
      - NEXT_PUBLIC_MAP_STYLE_URL=${NEXT_PUBLIC_MAP_STYLE_URL}
      - NEXT_PUBLIC_STORAGE_ORIGINALS=report-originals
      - NEXT_PUBLIC_STORAGE_REDACTED=report-redacted
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://${DOMAIN}
    env_file:
      - .env.production
    restart: unless-stopped
    networks:
      - drm04-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

  ai:
    build:
      context: ./apps/ai
      dockerfile: Dockerfile.prod
    container_name: drm04-ai
    environment:
      - AI_PROVIDER=${AI_PROVIDER}
      - AI_API_KEY=${AI_API_KEY}
      - AI_MODEL=${AI_MODEL}
      - AI_MODEL_VERSION=${AI_MODEL_VERSION}
      - AI_BASE_URL=${AI_BASE_URL}
      - CONFIDENCE_THRESHOLD=${CONFIDENCE_THRESHOLD}
      - ENVIRONMENT=production
    env_file:
      - .env.production
    restart: unless-stopped
    networks:
      - drm04-network
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '1'
          memory: 2G

  postgres:
    image: postgis/postgis:16-3.4
    container_name: drm04-postgres
    environment:
      POSTGRES_DB: drm04
      POSTGRES_USER: drm04
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/init:/docker-entrypoint-initdb.d
    secrets:
      - postgres_password
    restart: unless-stopped
    networks:
      - drm04-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '0.5'
          memory: 1G

volumes:
  postgres_data:

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt

networks:
  drm04-network:
    driver: bridge
```

#### Deploy

```bash
# Create secrets
mkdir -p secrets
openssl rand -base64 32 > secrets/postgres_password.txt

# Create production env
cp .env.production.example .env.production
# Edit .env.production with production values

# Deploy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

### 2. Kubernetes Deployment

See [Kubernetes Manifests](#kubernetes-manifests) section below for complete manifests.

#### Quick Deploy with Helm

```bash
# Add repo (if published)
helm repo add drm04 https://charts.drm04.example.com
helm repo update

# Install
helm install drm04 drm04/drm04 \
  --namespace drm04 \
  --create-namespace \
  --values values-prod.yaml

# Or install from local chart
helm install drm04 ./helm/drm04 \
  --namespace drm04 \
  --create-namespace \
  --values ./helm/drm04/values-prod.yaml
```

---

### 3. Vercel (Web) + Managed Services

#### Vercel Deployment

1. Connect repository to Vercel
2. Set root directory to `apps/web`
3. Configure environment variables in Vercel dashboard
4. Deploy

```bash
# Vercel CLI
vercel --prod
```

#### Required Vercel Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |
| `AI_SERVICE_URL` | AI service URL (e.g., Railway/Render URL) |
| `AI_SERVICE_KEY` | API key for AI service |
| `NEXTAUTH_SECRET` | Auth secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Production URL (e.g., https://drm04.example.com) |

#### AI Service on Railway/Render

**Railway:**
```bash
railway login
railway init
railway add --dockerfile apps/ai/Dockerfile.prod
railway up
```

**Render:**
- Create Web Service from Docker
- Set Dockerfile path: `apps/ai/Dockerfile.prod`
- Configure environment variables

#### Database on Supabase Cloud

1. Create project at https://supabase.com
2. Enable PostGIS: `CREATE EXTENSION postgis;`
3. Run migrations from `supabase/migrations/` in order
4. Create storage buckets: `report-originals`, `report-redacted`
5. Copy connection details to environment variables

---

## Environment Variables Reference

### Root (.env.production)

```bash
# =============================================================================
# DRM04 Production Environment Variables
# =============================================================================
# Copy to .env.production and fill in all values
# =============================================================================

# --- Domain & SSL ---
DOMAIN=drm04.example.com
SSL_EMAIL=admin@example.com

# --- Database (Supabase/PostgreSQL) ---
DATABASE_URL=postgresql://user:pass@host:5432/drm04?sslmode=require
SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret

# --- AI Service ---
AI_SERVICE_URL=https://ai.drm04.example.com
AI_SERVICE_KEY=sk-ai-service-key-change-me
AI_PROVIDER=openai          # openai | gemini | demo
AI_API_KEY=sk-...           # OpenAI/Gemini API key
AI_MODEL=gpt-4o             # or gemini-1.5-pro, demo-vision-1
AI_MODEL_VERSION=1.0
AI_BASE_URL=                # Optional: custom endpoint
CONFIDENCE_THRESHOLD=0.60

# --- Auth ---
NEXTAUTH_SECRET=openssl rand -base64 32
NEXTAUTH_URL=https://drm04.example.com

# --- Maps ---
NEXT_PUBLIC_MAP_STYLE_URL=https://tiles.example.com/style.json
NEXT_PUBLIC_MAP_TILE_URL=https://tiles.example.com/{z}/{x}/{y}.png

# --- Storage ---
NEXT_PUBLIC_STORAGE_ORIGINALS=report-originals
NEXT_PUBLIC_STORAGE_REDACTED=report-redacted
SUPABASE_STORAGE_URL=https://xxxxx.supabase.co/storage/v1

# --- Feature Flags ---
ENABLE_AI_ASSESSMENT=true
ENABLE_FACE_REDACTION=true
ENABLE_OFFLINE_MODE=false
ENABLE_MULTILINGUAL=false

# --- Monitoring ---
SENTRY_DSN=https://...
LOG_LEVEL=info
```

### Web App (apps/web/.env.production)

```bash
# Inherits from root .env.production
# Add web-specific overrides if needed
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### AI Service (apps/ai/.env.production)

```bash
# Inherits from root .env.production
# Add AI-specific overrides if needed
ENVIRONMENT=production
PYTHONUNBUFFERED=1
```

---

## API Documentation

### OpenAPI/Swagger Specification

The API is documented using OpenAPI 3.0. View interactive docs at:

- **Web App**: `https://your-domain.com/api/docs` (if enabled)
- **AI Service**: `https://ai.your-domain.com/docs` (FastAPI auto-generated)

### Web App API Routes

#### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | None |
| POST | `/api/auth/signin` | Sign in user | None |
| POST | `/api/auth/signout` | Sign out user | Session |
| GET | `/api/auth/session` | Get current session | Session |

#### Reports

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/reports` | Create new report | Session | citizen |
| GET | `/api/reports` | List reports (paginated) | Session | all |
| GET | `/api/reports/[id]` | Get report details | Session | owner/staff |
| PATCH | `/api/reports/[id]` | Update report | Session | staff |
| DELETE | `/api/reports/[id]` | Delete report | Session | admin |

#### Verification (Authority)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/reports/[id]/verify` | Verify/reject report | Session | authority |
| POST | `/api/reports/[id]/escalate` | Escalate report | Session | authority |
| GET | `/api/reports/[id]/history` | Get verification history | Session | staff |

#### Export

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/export/csv` | Export reports as CSV | Session | analyst, admin |
| GET | `/api/export/pdf` | Export report as PDF | Session | staff |

#### Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Basic health check | None |
| GET | `/api/health/ready` | Readiness check (DB, AI) | None |
| GET | `/api/health/live` | Liveness check | None |

### AI Service API

Base URL: `https://ai.your-domain.com`

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/health/ready` | Readiness (model loaded) |
| GET | `/health/live` | Liveness |
| POST | `/assess` | Assess disaster damage from image |
| POST | `/redact` | Redact faces from image |

#### `/assess` Request

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "disaster_type": "flood",
  "description": "Optional description",
  "metadata": {
    "source": "mobile",
    "device": "iPhone 15"
  }
}
```

#### `/assess` Response

```json
{
  "severity": "moderate",
  "confidence": 0.87,
  "indicators": ["standing water", "submerged vehicles", "damaged buildings"],
  "explanation": "Image shows residential area with 1-2 feet of standing water...",
  "status": "assessed",
  "provider": "openai",
  "model_name": "gpt-4o",
  "model_version": "1.0",
  "processing_time_ms": 1245
}
```

#### Severity Levels

| Level | Description |
|-------|-------------|
| `unclear` | AI cannot determine (low confidence) |
| `minor` | Cosmetic damage, no safety risk |
| `moderate` | Functional impairment, repairable |
| `severe` | Major structural damage, unsafe |
| `critical` | Collapse imminent, life safety risk |

#### `/redact` Request

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

#### `/redact` Response

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "faces_detected": 3
}
```

### Error Responses

All endpoints return standardized errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "image", "message": "Image is required" }
    ]
  }
}
```

| HTTP Code | Error Code | Description |
|-----------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request body |
| 401 | `UNAUTHORIZED` | Missing/invalid authentication |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 422 | `UNPROCESSABLE_ENTITY` | Semantic validation failed |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Dependency unavailable |

---

## Database Schema Diagram

```mermaid
erDiagram
    PROFILES ||--o{ REPORTS : "reports"
    PROFILES {
        uuid user_id PK
        text email
        text phone
        text display_name
        text organization
        uuid jurisdiction_id FK
        text role "citizen|volunteer|authority|analyst|admin"
        text status "active|suspended|invited"
        timestamptz created_at
        timestamptz updated_at
    }

    JURISDICTIONS ||--o{ PROFILES : "profiles"
    JURISDICTIONS {
        uuid id PK
        text name
        text type
        geography geometry
        uuid parent_id FK
        timestamptz created_at
    }

    REPORTS ||--o{ REPORT_MEDIA : "media"
    REPORTS ||--o{ AI_ASSESSMENTS : "assessments"
    REPORTS ||--o{ VERIFICATION_EVENTS : "verifications"
    REPORTS ||--o{ REPORT_TAGS : "tags"
    REPORTS {
        uuid id PK
        uuid reporter_id FK
        text disaster_type
        text asset_type
        text description
        text observed_severity
        text ai_severity
        numeric ai_confidence
        text final_severity
        integer priority_score
        text verification_status
        text operational_status
        integer affected_people
        boolean infrastructure_impact
        boolean accessibility_blocked
        geography location
        numeric location_accuracy_m
        text location_source
        timestamptz occurred_at
        timestamptz submitted_at
        timestamptz updated_at
    }

    REPORT_MEDIA {
        uuid id PK
        uuid report_id FK
        text storage_path
        text media_type
        integer file_size
        text sha256
        text perceptual_hash
        boolean privacy_processed
        text privacy_status
        boolean is_original
        timestamptz created_at
    }

    AI_ASSESSMENTS {
        uuid id PK
        uuid report_id FK
        text provider
        text model_name
        text model_version
        text predicted_category
        text predicted_severity
        numeric confidence
        jsonb indicators
        text explanation
        text status
        integer processing_time_ms
        timestamptz created_at
    }

    VERIFICATION_EVENTS {
        uuid id PK
        uuid report_id FK
        uuid reviewer_id FK
        text previous_severity
        text new_severity
        text previous_status
        text new_status
        text reason
        text notes
        timestamptz created_at
    }

    REPORT_TAGS {
        uuid id PK
        uuid report_id FK
        text tag
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK
        text action
        text resource_type
        uuid resource_id
        jsonb metadata
        timestamptz created_at
    }
```

### Key Indexes

```sql
-- Spatial queries
CREATE INDEX reports_location_idx ON reports USING GIST (location);
CREATE INDEX jurisdictions_geom_idx ON jurisdictions USING GIST (geometry);

-- Common query patterns
CREATE INDEX reports_reporter_idx ON reports (reporter_id);
CREATE INDEX reports_submitted_idx ON reports (submitted_at DESC);
CREATE INDEX reports_disaster_idx ON reports (disaster_type);
CREATE INDEX reports_final_severity_idx ON reports (final_severity);
CREATE INDEX reports_verification_idx ON reports (verification_status);
CREATE INDEX reports_operational_idx ON reports (operational_status);
CREATE INDEX reports_priority_idx ON reports (priority_score DESC);

-- Foreign key indexes
CREATE INDEX report_media_report_idx ON report_media (report_id);
CREATE INDEX ai_assessments_report_idx ON ai_assessments (report_id);
CREATE INDEX verification_events_report_idx ON verification_events (report_id);
CREATE INDEX report_tags_report_idx ON report_tags (report_id);
CREATE INDEX audit_logs_actor_idx ON audit_logs (actor_id);
CREATE INDEX audit_logs_created_idx ON audit_logs (created_at DESC);
```

---

## Contributing Guide

### Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/DRDM04.git`
3. **Create branch**: `git checkout -b feature/your-feature-name`
4. **Setup locally** (see [Local Development](#local-development))

### Development Workflow

```bash
# 1. Make changes
# 2. Run tests
cd apps/web && npm run lint && npm run typecheck && npm run build
cd ../ai && pytest

# 3. Commit with conventional commits
git add .
git commit -m "feat: add export to GeoJSON format"

# 4. Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`

Examples:
- `feat(web): add CSV export for authority dashboard`
- `fix(ai): handle corrupted image in redact endpoint`
- `docs: update API documentation for /assess endpoint`
- `refactor(web): extract map component to separate file`

### Pull Request Checklist

- [ ] Code follows project style (lint, typecheck pass)
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated (README, API docs, comments)
- [ ] No breaking changes without version bump
- [ ] Security considerations addressed (RLS, input validation)
- [ ] Performance impact assessed

### Code Style

#### TypeScript/Next.js
- ESLint + Prettier (configured)
- Strict TypeScript (`strict: true`)
- Functional components with hooks
- Server Components by default, Client Components when needed

#### Python/FastAPI
- Black formatter (line length 100)
- Type hints required
- Pydantic models for validation
- Async/await for I/O

### Testing

```bash
# Web
cd apps/web
npm run test           # Unit tests (when added)
npm run test:e2e       # E2E tests (when added)

# AI
cd apps/ai
pytest                 # All tests
pytest -v              # Verbose
pytest --cov=app       # Coverage
```

### Security

- Never commit secrets (`.env*`, keys, tokens)
- All database access through RLS policies
- Input validation on all endpoints
- Rate limiting on public endpoints
- CSP headers on all responses

### Release Process

1. Update version in `package.json` / `pyproject.toml`
2. Update `CHANGELOG.md`
3. Create release tag: `git tag v1.2.0`
4. GitHub Actions builds and publishes Docker images
5. Deploy to staging → production

---

## Additional Documentation

- [Architecture Deep Dive](docs/architecture.md)
- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Security Model](docs/security.md)
- [Database Migrations](docs/migrations.md)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/DRDM04/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/DRDM04/discussions)
- **Security**: Email security@drm04.example.com

---

*Built for SIH DRM04 — Crowdsourced Disaster Damage Assessment*