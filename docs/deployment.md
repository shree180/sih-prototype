# DRM04 Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Docker Compose Deployment](#docker-compose-deployment)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Helm Deployment](#helm-deployment)
7. [Vercel + Managed Services](#vercel--managed-services)
8. [SSL/TLS Configuration](#ssltls-configuration)
9. [Monitoring & Observability](#monitoring--observability)
10. [Backup & Restore](#backup--restore)
11. [Rollback Procedures](#rollback-procedures)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Docker | 24+ | Container runtime |
| Docker Compose | v2+ | Multi-container orchestration |
| kubectl | 1.28+ | Kubernetes CLI |
| Helm | 3.12+ | Kubernetes package manager |
| Terraform | 1.6+ | Infrastructure (optional) |
| Supabase CLI | 1.150+ | Local Supabase (optional) |

### Cloud Accounts

- **Container Registry**: GitHub Container Registry (ghcr.io) or Docker Hub
- **Kubernetes**: EKS, GKE, AKS, or self-managed
- **Database**: Supabase Cloud, AWS RDS, Cloud SQL, or self-hosted PostgreSQL
- **DNS**: Route53, Cloudflare, or similar
- **TLS**: Let's Encrypt (cert-manager) or managed certificates
- **Monitoring**: Prometheus/Grafana, Datadog, or similar

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/DRDM04.git
cd DRDM04
```

### 2. Configure Environment Variables

```bash
# Copy production template
cp .env.production.example .env.production

# Edit with your values
vim .env.production
```

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only)
- `AI_SERVICE_KEY` - Shared secret for web↔AI communication
- `AI_API_KEY` - OpenAI/Gemini API key
- `NEXTAUTH_SECRET` - Generate: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Production URL (e.g., https://drm04.example.com)

### 3. Generate Secrets

```bash
# Database password
openssl rand -base64 32 > secrets/postgres_password.txt

# NEXTAUTH_SECRET
openssl rand -base64 32

# AI service key
openssl rand -base64 32

# JWT secret
openssl rand -base64 64
```

---

## Database Setup

### Option A: Supabase Cloud (Recommended)

1. Create project at https://supabase.com
2. Note project URL and keys
3. Enable PostGIS: SQL Editor → `CREATE EXTENSION postgis;`
4. Run migrations in order:

```bash
# Using Supabase CLI
supabase link --project-ref YOUR_PROJECT_REF
supabase db push

# Or manually in SQL Editor (run in order):
# 1. supabase/migrations/0001_init.sql
# 2. supabase/migrations/0002_functions.sql
# 3. supabase/migrations/0004_rpc.sql
# 4. supabase/migrations/0005_profiles_trigger.sql
# 5. supabase/seed/0003_seed.sql (after creating demo users)
```

5. Create storage buckets:
   - `report-originals` (private)
   - `report-redacted` (private)

6. Configure RLS policies (included in migrations)

### Option B: Self-Hosted PostgreSQL

```bash
# With Docker
docker run -d \
  --name drm04-postgres \
  -e POSTGRES_DB=drm04 \
  -e POSTGRES_USER=drm04 \
  -e POSTGRES_PASSWORD=secure_password \
  -v postgres_data:/var/lib/postgresql/data \
  -v ./supabase/migrations:/docker-entrypoint-initdb.d \
  -p 5432:5432 \
  postgis/postgis:16-3.4
```

---

## Docker Compose Deployment

### Development

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Production

```bash
# Create production env
cp .env.production.example .env.production
# Edit .env.production

# Create secrets directory
mkdir -p secrets
openssl rand -base64 32 > secrets/postgres_password.txt

# Deploy with production compose file
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check status
docker compose ps
docker compose logs -f nginx
```

### Docker Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Base configuration |
| `docker-compose.prod.yml` | Production overrides (nginx, resources, secrets) |
| `docker-compose.override.yml` | Local development overrides (gitignored) |

---

## Kubernetes Deployment

### 1. Cluster Preparation

```bash
# Create namespace
kubectl apply -f k8s/base/namespace.yaml

# Install cert-manager (for Let's Encrypt)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Install NGINX Ingress Controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace

# Create cluster issuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF
```

### 2. Apply Manifests

```bash
# Apply base resources
kubectl apply -f k8s/base/

# Or use kustomize
kubectl apply -k k8s/overlays/production/
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -n drm04

# Check services
kubectl get svc -n drm04

# Check ingress
kubectl get ingress -n drm04

# Check HPA
kubectl get hpa -n drm04

# View logs
kubectl logs -n drm04 -l app=drm04-web -f
kubectl logs -n drm04 -l app=drm04-ai -f
```

### 4. Access Application

```bash
# Get ingress IP
kubectl get ingress drm04-web -n drm04 -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Or if using DNS
# Configure DNS A record to point to ingress IP
```

---

## Helm Deployment

### 1. Install Chart

```bash
# From local chart
helm install drm04 ./helm/drm04 \
  --namespace drm04 \
  --create-namespace \
  --values ./helm/drm04/values-prod.yaml

# Or from repository (if published)
helm repo add drm04 https://charts.drm04.example.com
helm install drm04 drm04/drm04 \
  --namespace drm04 \
  --create-namespace \
  --values values-prod.yaml
```

### 2. Upgrade

```bash
helm upgrade drm04 ./helm/drm04 \
  --namespace drm04 \
  --values ./helm/drm04/values-prod.yaml
```

### 3. Rollback

```bash
# List releases
helm history drm04 -n drm04

# Rollback to revision
helm rollback drm04 3 -n drm04
```

### 4. Uninstall

```bash
helm uninstall drm04 -n drm04
# Note: PVCs for PostgreSQL are retained by default
```

---

## Vercel + Managed Services

### 1. Vercel (Web App)

1. Import repository in Vercel
2. Set **Root Directory**: `apps/web`
3. Configure Environment Variables in Vercel Dashboard:
   - All variables from `.env.production`
4. Deploy

```bash
# Or via CLI
vercel --prod
```

**Vercel Settings:**
- Build Command: `npm run build`
- Output Directory: `.next` (standalone)
- Install Command: `npm ci`

### 2. Railway/Render (AI Service)

**Railway:**
```bash
railway login
railway init
railway add --dockerfile apps/ai/Dockerfile.prod
railway variables set AI_PROVIDER=openai AI_API_KEY=... CONFIDENCE_THRESHOLD=0.60
railway up
```

**Render:**
- Create Web Service
- Repository: DRDM04
- Dockerfile Path: `apps/ai/Dockerfile.prod`
- Environment Variables: Set in dashboard

### 3. Supabase (Database)

1. Create project
2. Run migrations (see Database Setup)
3. Copy connection details to Vercel/Railway env vars

---

## SSL/TLS Configuration

### Let's Encrypt with cert-manager (Kubernetes)

```yaml
# Ingress annotations for auto-TLS
annotations:
  cert-manager.io/cluster-issuer: letsencrypt-prod
  nginx.ingress.kubernetes.io/ssl-redirect: "true"
```

### Manual Certificate (Docker Compose)

```bash
# Generate self-signed for testing
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/CN=drm04.example.com"

# Production: Use Let's Encrypt with certbot
certbot certonly --standalone -d drm04.example.com -d ai.drm04.example.com
```

### Nginx SSL Config

Key settings in `nginx/nginx.prod.conf`:
- TLS 1.2/1.3 only
- Strong cipher suites
- OCSP Stapling
- HSTS (1 year)
- Secure headers

---

## Monitoring & Observability

### Prometheus Metrics

**Web App** (`/api/metrics`):
- HTTP request duration
- Active connections
- Database query latency
- Cache hit/miss

**AI Service** (`/metrics`):
- Request duration per endpoint
- Model inference time
- Queue depth
- Error rates

**PostgreSQL** (postgres-exporter):
- Connection count
- Query performance
- Replication lag
- Disk usage

### Grafana Dashboards

Import dashboards:
- Node Exporter Full (1860)
- PostgreSQL (9628)
- NGINX (12614)
- Custom DRM04 dashboard (create from metrics)

### Alerting Rules

```yaml
groups:
  - name: drm04
    rules:
      - alert: WebDown
        expr: up{job="drm04-web"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Web service down"
      
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate on {{ $labels.job }}"
      
      - alert: DatabaseConnectionsHigh
        expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database connections at 80%"
```

### Logging

```bash
# View structured logs
kubectl logs -n drm04 -l app=drm04-web --tail=100 -f | jq .

# Filter by level
kubectl logs -n drm04 -l app=drm04-web | jq 'select(.level=="error")'
```

---

## Backup & Restore

### Automated Backup Script

```bash
# Run backup
./scripts/backup-postgres.sh

# Restore from backup
./scripts/restore-postgres.sh backup_20240115_030000.sql.gz
```

See [Backup Scripts](#backup-scripts) section for details.

### Database Backup (Supabase)

```bash
# Using Supabase CLI
supabase db dump --file backup_$(date +%Y%m%d).sql

# Using pg_dump
pg_dump -h db.host -U drm04 -d drm04 | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Point-in-Time Recovery

Supabase/Cloud SQL: Enable PITR in dashboard (7-35 day retention)

Self-hosted: Configure WAL archiving + base backups

---

## Rollback Procedures

### Kubernetes (Helm)

```bash
# Check history
helm history drm04 -n drm04

# Rollback to previous version
helm rollback drm04 -n drm04

# Rollback to specific revision
helm rollback drm04 5 -n drm04
```

### Kubernetes (kubectl)

```bash
# Rollback deployment
kubectl rollout undo deployment/drm04-web -n drm04
kubectl rollout undo deployment/drm04-ai -n drm04

# Check status
kubectl rollout status deployment/drm04-web -n drm04
```

### Docker Compose

```bash
# Tag current images before deploy
docker tag drm04-web:latest drm04-web:backup-$(date +%Y%m%d)
docker tag drm04-ai:latest drm04-ai:backup-$(date +%Y%m%d)

# Rollback
docker compose down
docker tag drm04-web:backup-20240115 drm04-web:latest
docker tag drm04-ai:backup-20240115 drm04-ai:latest
docker compose up -d
```

### Database Rollback

```bash
# Restore from backup
./scripts/restore-postgres.sh backup_20240115_030000.sql.gz

# Or use PITR (Supabase/Cloud SQL)
# Dashboard → Backups → Restore to point in time
```

---

## Troubleshooting

### Common Issues

#### Web App Won't Start

```bash
# Check logs
docker compose logs web
# or
kubectl logs -n drm04 -l app=drm04-web

# Common causes:
# - Missing env vars (check .env.production)
# - Database connection failed
# - Build failed (check Dockerfile)
```

#### AI Service Returns 503

```bash
# Check AI service logs
docker compose logs ai
# or
kubectl logs -n drm04 -l app=drm04-ai

# Common causes:
# - AI_API_KEY not set or invalid
# - Model loading failed (OOM)
# - OpenCV not installed
```

#### Database Connection Failed

```bash
# Check PostgreSQL logs
docker compose logs postgres
# or
kubectl logs -n drm04 -l app=postgres

# Test connection
psql postgresql://drm04:pass@host:5432/drm04 -c "SELECT 1;"

# Common causes:
# - Wrong credentials
# - SSL mode mismatch
- Database not initialized (migrations not run)
```

#### High Latency / Timeouts

```bash
# Check resource usage
kubectl top pods -n drm04

# Check HPA status
kubectl get hpa -n drm04

# Increase resources or replicas
kubectl scale deployment drm04-web --replicas=10 -n drm04
```

#### SSL Certificate Issues

```bash
# Check cert-manager
kubectl get certificates -n drm04
kubectl describe certificate drm04-tls -n drm04

# Check ingress
kubectl describe ingress drm04-web -n drm04
```

### Debug Commands

```bash
# Execute into pod
kubectl exec -it -n drm04 deployment/drm04-web -- sh

# Port forward for local debugging
kubectl port-forward -n drm04 svc/drm04-web 3000:80
kubectl port-forward -n drm04 svc/drm04-ai 8000:8000
kubectl port-forward -n drm04 svc/postgres 5432:5432

# Check configmap/secret values
kubectl get configmap drm04-config -n drm04 -o yaml
kubectl get secret drm04-secrets -n drm04 -o yaml
```

---

## Maintenance Windows

| Task | Frequency | Window |
|------|-----------|--------|
| Security patches | Weekly | Sunday 02:00-04:00 UTC |
| Dependency updates | Weekly | Monday 09:00 UTC (Dependabot) |
| Database vacuum | Daily | 03:00 UTC |
| Log rotation | Daily | 00:00 UTC |
| Certificate renewal | Automatic | 30 days before expiry |

---

## Support Contacts

| Role | Contact |
|------|---------|
| Platform Team | platform@drm04.example.com |
| On-Call | +1-555-ONCALL |
| Security | security@drm04.example.com |