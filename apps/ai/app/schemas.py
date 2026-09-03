from pydantic import BaseModel, Field
from typing import List, Literal, Optional

Severity = Literal["unclear", "minor", "moderate", "severe", "critical"]
AssessmentStatus = Literal["assessed", "needs_human_review", "processing_failed"]

DISASTER_TYPES = [
    "flood", "earthquake", "cyclone", "fire", "landslide",
    "drought", "industrial", "building_collapse", "other",
]


class AssessRequest(BaseModel):
    image: str = Field(..., description="Base64-encoded image (data URL or raw base64)")
    disaster_type: str = Field(..., description="One of the supported disaster types")
    description: Optional[str] = None
    metadata: Optional[dict] = None


class Assessment(BaseModel):
    severity: Severity
    confidence: float = Field(..., ge=0.0, le=1.0)
    indicators: List[str] = Field(default_factory=list)
    explanation: str
    status: AssessmentStatus


class AssessResponse(BaseModel):
    severity: Severity
    confidence: float
    indicators: List[str]
    explanation: str
    status: AssessmentStatus
    provider: str
    model_name: str
    model_version: str
    processing_time_ms: int
