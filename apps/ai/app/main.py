import base64
import time
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

from app.schemas import AssessRequest, AssessResponse
from app.services.assessment import assess
from app.config import settings

# Optional privacy import — if OpenCV not available, provide a no-op fallback.
try:
    from app.services.privacy import redact_faces
except Exception:  # ImportError, ModuleNotFoundError, etc.
    def redact_faces(image_bytes: bytes, blur_kernel: int = 31) -> tuple[bytes, int]:
        # No-op fallback: return original image, 0 faces detected.
        return image_bytes, 0


# Prometheus metrics
ASSESS_REQUESTS = Counter("ai_assess_requests_total", "Total assess requests", ["severity", "status"])
ASSESS_DURATION = Histogram("ai_assess_duration_seconds", "Assess request duration")
REDACT_REQUESTS = Counter("ai_redact_requests_total", "Total redact requests")
REDACT_DURATION = Histogram("ai_redact_duration_seconds", "Redact request duration")
MODEL_INFERENCE_DURATION = Histogram("ai_model_inference_duration_seconds", "Model inference duration")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.startup_time = time.time()
    app.state.model_loaded = True  # Set to False if loading model asynchronously
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Disaster Damage Assessment AI",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to the Next.js origin in production
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class RedactRequest(BaseModel):
    image: str  # base64 or data URL


class RedactResponse(BaseModel):
    image: str  # base64 jpeg
    faces_detected: int


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    provider: str | None = None
    model: str | None = None
    modelLoaded: bool | None = None
    uptimeSeconds: float | None = None


def require_service_key(x_api_key: str | None = Header(default=None)) -> None:
    """Protect model and privacy endpoints without exposing configuration in health checks."""
    if settings.ai_service_key and x_api_key != settings.ai_service_key:
        raise HTTPException(status_code=401, detail="Invalid AI service key")


@app.get("/health", response_model=HealthResponse)
async def health():
    """Basic health check - does not expose secrets or sensitive model configuration."""
    return HealthResponse(
        status="ok",
        service="ai-assess",
        version="1.0.0",
        provider=settings.ai_provider if settings.ai_provider != "demo" else "demo",
        model=settings.ai_model if settings.ai_provider != "demo" else "demo-vision-1",
    )


@app.get("/health/live", response_model=HealthResponse)
async def health_live():
    """Liveness check - indicates process is running."""
    return HealthResponse(
        status="alive",
        service="ai-assess",
        version="1.0.0",
        uptimeSeconds=time.time() - app.state.startup_time,
    )


@app.get("/health/ready", response_model=HealthResponse)
async def health_ready():
    """Readiness check - indicates service can handle requests (model loaded)."""
    if not app.state.model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")

    return HealthResponse(
        status="ready",
        service="ai-assess",
        version="1.0.0",
        provider=settings.ai_provider if settings.ai_provider != "demo" else "demo",
        model=settings.ai_model if settings.ai_provider != "demo" else "demo-vision-1",
        modelLoaded=app.state.model_loaded,
        uptimeSeconds=time.time() - app.state.startup_time,
    )


@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/assess", response_model=AssessResponse)
async def assess_endpoint(req: AssessRequest, _: None = Depends(require_service_key)):
    if not req.image or not req.disaster_type:
        raise HTTPException(status_code=422, detail="image and disaster_type required")

    with ASSESS_DURATION.time():
        result = await assess(req)

    ASSESS_REQUESTS.labels(severity=result.severity, status=result.status).inc()

    return result


@app.post("/redact", response_model=RedactResponse)
async def redact_endpoint(req: RedactRequest, _: None = Depends(require_service_key)):
    raw = req.image
    if raw.startswith("data:"):
        raw = raw.split(",", 1)[1]

    with REDACT_DURATION.time():
        try:
            out, count = redact_faces(base64.b64decode(raw))
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"privacy processing failed: {e}")

    REDACT_REQUESTS.inc()

    return RedactResponse(image=base64.b64encode(out).decode(), faces_detected=count)
