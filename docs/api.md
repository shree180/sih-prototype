# DRM04 API Documentation

## Overview

This document describes the REST APIs for the DRM04 system, including both the Next.js web application API and the FastAI AI service API.

---

## Web Application API

**Base URL:** `https://api.drm04.example.com` (or `http://localhost:3000` locally)

**Authentication:** Supabase JWT via httpOnly cookie or `Authorization: Bearer <token>` header

**Content-Type:** `application/json` (unless multipart for file uploads)

### Common Headers

| Header | Description |
|--------|-------------|
| `Authorization` | Bearer token (alternative to cookie) |
| `X-Request-ID` | Client-generated UUID for tracing |
| `Accept-Language` | Preferred language (future) |

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [],
    "requestId": "uuid"
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Authentication Endpoints

### Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "displayName": "John Doe",
  "phone": "+15551234567",
  "role": "citizen"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "citizen",
    "emailConfirmed": false
  },
  "session": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "expiresAt": "2024-01-15T10:30:00Z"
  }
}
```

### Sign In

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):** Same as sign up

### Sign Out

```http
POST /api/auth/signout
```

**Response (200):**
```json
{
  "message": "Signed out successfully"
}
```

### Get Session

```http
GET /api/auth/session
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "citizen",
    "jurisdictionId": "uuid"
  },
  "expiresAt": "2024-01-15T10:30:00Z"
}
```

---

## Reports Endpoints

### Create Report

```http
POST /api/reports
Content-Type: multipart/form-data

# Form fields:
# - disaster_type (required): flood|earthquake|cyclone|fire|landslide|drought|industrial|building_collapse|other
# - description (optional)
# - observed_severity (optional): minor|moderate|severe|critical
# - asset_type (optional)
# - affected_people (optional, integer)
# - infrastructure_impact (optional, boolean)
# - accessibility_blocked (optional, boolean)
# - location (required): "POINT(lon lat)" WKT or JSON {lat, lng}
# - location_accuracy_m (optional, number)
# - location_source (optional): gps|manual|address
# - occurred_at (optional, ISO 8601)
# - files[] (required, 1-5 images): image files
```

**Response (201):**
```json
{
  "report": {
    "id": "uuid",
    "reporterId": "uuid",
    "disasterType": "flood",
    "description": "Water rising in basement",
    "observedSeverity": "moderate",
    "assetType": "residential",
    "affectedPeople": 4,
    "infrastructureImpact": true,
    "accessibilityBlocked": false,
    "location": "POINT(-122.4194 37.7749)",
    "locationAccuracyM": 10,
    "locationSource": "gps",
    "occurredAt": "2024-01-15T08:00:00Z",
    "submittedAt": "2024-01-15T08:05:00Z",
    "verificationStatus": "unverified",
    "operationalStatus": "new",
    "priorityScore": 0,
    "media": [
      {
        "id": "uuid",
        "storagePath": "report-originals/user-id/report-id/uuid.jpg",
        "mediaType": "image/jpeg",
        "fileSize": 2048576,
        "sha256": "hash...",
        "privacyProcessed": false,
        "privacyStatus": "pending",
        "isOriginal": true
      }
    ]
  }
}
```

### List Reports

```http
GET /api/reports?page=1&limit=20&disaster_type=flood&verification_status=unverified&severity=severe&jurisdiction_id=uuid&date_from=2024-01-01&date_to=2024-01-31&sort=submitted_at&order=desc
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 20, max: 100) |
| `disaster_type` | string | Filter by disaster type |
| `verification_status` | string | unverified\|verified\|rejected\|needs_review\|escalated |
| `severity` | string | Filter by final_severity |
| `jurisdiction_id` | uuid | Filter by jurisdiction |
| `date_from` | date | Submitted after (ISO 8601) |
| `date_to` | date | Submitted before (ISO 8601) |
| `sort` | string | submitted_at\|priority_score\|final_severity |
| `order` | string | asc\|desc |
| `bbox` | string | Bounding box "minLon,minLat,maxLon,maxLat" |
| `radius_km` | number | Radius from lat,lng (requires center) |
| `center` | string | "lat,lng" for radius search |

**Response (200):**
```json
{
  "reports": [
    {
      "id": "uuid",
      "reporterId": "uuid",
      "disasterType": "flood",
      "description": "Water rising...",
      "finalSeverity": "moderate",
      "verificationStatus": "verified",
      "operationalStatus": "in_progress",
      "priorityScore": 75,
      "submittedAt": "2024-01-15T08:05:00Z",
      "location": "POINT(-122.4194 37.7749)",
      "media": [
        {
          "id": "uuid",
          "storagePath": "report-redacted/...",
          "mediaType": "image/jpeg",
          "isOriginal": false
        }
      ],
      "aiAssessment": {
        "severity": "moderate",
        "confidence": 0.87,
        "status": "assessed"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Get Report Details

```http
GET /api/reports/{id}
```

**Response (200):**
```json
{
  "report": {
    "id": "uuid",
    "reporterId": "uuid",
    "reporter": {
      "displayName": "John Doe",
      "phone": "+15551234567"
    },
    "disasterType": "flood",
    "assetType": "residential",
    "description": "Water rising in basement, family trapped",
    "observedSeverity": "moderate",
    "aiSeverity": "moderate",
    "aiConfidence": 0.87,
    "finalSeverity": "moderate",
    "priorityScore": 75,
    "verificationStatus": "verified",
    "operationalStatus": "in_progress",
    "affectedPeople": 4,
    "infrastructureImpact": true,
    "accessibilityBlocked": false,
    "location": "POINT(-122.4194 37.7749)",
    "locationAccuracyM": 10,
    "locationSource": "gps",
    "occurredAt": "2024-01-15T08:00:00Z",
    "submittedAt": "2024-01-15T08:05:00Z",
    "updatedAt": "2024-01-15T09:30:00Z",
    "media": [
      {
        "id": "uuid",
        "storagePath": "report-originals/...",
        "mediaType": "image/jpeg",
        "fileSize": 2048576,
        "sha256": "hash...",
        "perceptualHash": "phash...",
        "privacyProcessed": true,
        "privacyStatus": "done",
        "isOriginal": true,
        "createdAt": "2024-01-15T08:05:00Z"
      },
      {
        "id": "uuid",
        "storagePath": "report-redacted/...",
        "mediaType": "image/jpeg",
        "isOriginal": false
      }
    ],
    "aiAssessments": [
      {
        "id": "uuid",
        "provider": "openai",
        "modelName": "gpt-4o",
        "modelVersion": "1.0",
        "predictedSeverity": "moderate",
        "confidence": 0.87,
        "indicators": ["standing water", "submerged vehicles"],
        "explanation": "Image shows residential area with 1-2 feet...",
        "status": "assessed",
        "processingTimeMs": 1245,
        "createdAt": "2024-01-15T08:06:00Z"
      }
    ],
    "verificationHistory": [
      {
        "id": "uuid",
        "reviewerId": "uuid",
        "reviewerName": "Jane Smith",
        "previousSeverity": "unclear",
        "newSeverity": "moderate",
        "previousStatus": "unverified",
        "newStatus": "verified",
        "reason": "Confirmed by ground team",
        "notes": "Water level rising, evacuation needed",
        "createdAt": "2024-01-15T09:30:00Z"
      }
    ],
    "tags": ["evacuation", "residential"]
  }
}
```

### Update Report (Staff Only)

```http
PATCH /api/reports/{id}
Content-Type: application/json

{
  "finalSeverity": "severe",
  "verificationStatus": "verified",
  "operationalStatus": "in_progress",
  "priorityScore": 85,
  "affectedPeople": 10,
  "tags": ["evacuation", "urgent"]
}
```

**Response (200):** Updated report object

### Delete Report (Admin Only)

```http
DELETE /api/reports/{id}
```

**Response (204):** No content

---

## Verification Endpoints (Authority)

### Verify Report

```http
POST /api/reports/{id}/verify
Content-Type: application/json

{
  "severity": "moderate",
  "status": "verified",
  "reason": "Confirmed by ground team",
  "notes": "Water level at 2ft, rising"
}
```

**Response (200):**
```json
{
  "verification": {
    "id": "uuid",
    "reportId": "uuid",
    "reviewerId": "uuid",
    "previousSeverity": "unclear",
    "newSeverity": "moderate",
    "previousStatus": "unverified",
    "newStatus": "verified",
    "reason": "Confirmed by ground team",
    "notes": "Water level at 2ft, rising",
    "createdAt": "2024-01-15T09:30:00Z"
  },
  "report": { ...updated report... }
}
```

### Escalate Report

```http
POST /api/reports/{id}/escalate
Content-Type: application/json

{
  "reason": "Requires state-level resources",
  "notes": "Multiple neighborhoods affected"
}
```

### Get Verification History

```http
GET /api/reports/{id}/history
```

**Response (200):**
```json
{
  "history": [
    {
      "id": "uuid",
      "reviewerId": "uuid",
      "reviewerName": "Jane Smith",
      "previousSeverity": "unclear",
      "newSeverity": "moderate",
      "previousStatus": "unverified",
      "newStatus": "verified",
      "reason": "Confirmed by ground team",
      "notes": "Water level at 2ft",
      "createdAt": "2024-01-15T09:30:00Z"
    }
  ]
}
```

---

## Export Endpoints (Analyst/Admin)

### Export CSV

```http
GET /api/export/csv?disaster_type=flood&date_from=2024-01-01&date_to=2024-01-31&verified_only=true
```

**Response:** CSV file download

**Columns:**
`id, disaster_type, final_severity, verification_status, priority_score, affected_people, latitude, longitude, submitted_at, verified_at, reporter_id, ai_confidence, ai_severity`

### Export PDF (Single Report)

```http
GET /api/export/pdf/{id}
```

**Response:** PDF file download with report details, photos, map, assessment

### Export GeoJSON

```http
GET /api/export/geojson?bbox=-122.5,37.7,-122.3,37.8
```

**Response (200):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.4194, 37.7749]
      },
      "properties": {
        "id": "uuid",
        "disasterType": "flood",
        "finalSeverity": "moderate",
        "priorityScore": 75,
        "submittedAt": "2024-01-15T08:05:00Z"
      }
    }
  ]
}
```

---

## Health Endpoints

### Basic Health

```http
GET /api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "service": "drm04-web",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Readiness Check

```http
GET /api/health/ready
```

Checks: Database connection, AI service reachable, Supabase reachable

**Response (200):**
```json
{
  "status": "ready",
  "checks": {
    "database": { "status": "ok", "latencyMs": 5 },
    "aiService": { "status": "ok", "latencyMs": 120 },
    "supabase": { "status": "ok", "latencyMs": 45 }
  }
}
```

**Response (503):**
```json
{
  "status": "not_ready",
  "checks": {
    "database": { "status": "ok" },
    "aiService": { "status": "fail", "error": "Connection refused" }
  }
}
```

### Liveness Check

```http
GET /api/health/live
```

**Response (200):**
```json
{
  "status": "alive",
  "uptimeSeconds": 3600
}
```

---

## AI Service API

**Base URL:** `https://ai.drm04.example.com` (or `http://localhost:8000` locally)

**Authentication:** API Key via `X-API-Key` header

### Health Check

```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "service": "ai-assess",
  "version": "1.0.0",
  "provider": "openai",
  "model": "gpt-4o"
}
```

### Readiness Check

```http
GET /health/ready
```

**Response (200):**
```json
{
  "status": "ready",
  "modelLoaded": true,
  "provider": "openai"
}
```

### Liveness Check

```http
GET /health/live
```

**Response (200):**
```json
{
  "status": "alive"
}
```

### Assess Damage

```http
POST /assess
Content-Type: application/json
X-API-Key: sk-ai-service-key

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "disaster_type": "flood",
  "description": "Optional context",
  "metadata": {
    "source": "mobile",
    "device": "iPhone 15"
  }
}
```

**Response (200):**
```json
{
  "severity": "moderate",
  "confidence": 0.87,
  "indicators": [
    "standing water",
    "submerged vehicles",
    "damaged buildings",
    "debris"
  ],
  "explanation": "Image shows residential area with 1-2 feet of standing water. Multiple vehicles partially submerged. Buildings show water damage at ground level. Debris visible in water.",
  "status": "assessed",
  "provider": "openai",
  "model_name": "gpt-4o",
  "model_version": "1.0",
  "processing_time_ms": 1245
}
```

**Severity Values:** `unclear`, `minor`, `moderate`, `severe`, `critical`

**Status Values:** `assessed`, `needs_human_review`, `processing_failed`

**Error Response (422):**
```json
{
  "detail": "image and disaster_type required"
}
```

### Redact Faces

```http
POST /redact
Content-Type: application/json
X-API-Key: sk-ai-service-key

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

**Response (200):**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "faces_detected": 3
}
```

**Error Response (422):**
```json
{
  "detail": "privacy processing failed: invalid image data"
}
```

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/*` | 5 req/min | Per IP |
| `/api/reports` (POST) | 10 req/min | Per user |
| `/api/reports` (GET) | 60 req/min | Per user |
| `/api/export/*` | 5 req/min | Per user |
| `/ai/assess` | 5 req/min | Per API key |
| `/ai/redact` | 10 req/min | Per API key |
| `/health*` | Unlimited | - |

Rate limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Webhooks (Future)

```http
POST /webhooks/report-created
POST /webhooks/report-verified
POST /webhooks/assessment-complete
```

---

## SDKs / Client Libraries

### JavaScript/TypeScript

```typescript
import { createClient } from '@drm04/client';

const client = createClient({
  baseUrl: 'https://api.drm04.example.com',
  authToken: 'user-jwt'
});

// Submit report
const report = await client.reports.create({
  disasterType: 'flood',
  description: 'Flooding in basement',
  location: { lat: 37.7749, lng: -122.4194 },
  files: [file1, file2]
});

// Get reports
const { reports, pagination } = await client.reports.list({
  disasterType: 'flood',
  verificationStatus: 'unverified',
  page: 1,
  limit: 20
});
```

### Python

```python
from drm04 import DRM04Client

client = DRM04Client(
    base_url="https://api.drm04.example.com",
    api_key="service-key"
)

# Assess damage
assessment = client.ai.assess(
    image=open("photo.jpg", "rb"),
    disaster_type="flood"
)

print(f"Severity: {assessment.severity}")
print(f"Confidence: {assessment.confidence}")
```