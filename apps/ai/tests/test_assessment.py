import asyncio
import base64

from app.config import settings
from app.schemas import AssessRequest
from app.services.assessment import assess

# Minimal valid 1x1 PNG (no Pillow needed).
_PNG_1x1 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
)


def _dummy_image_b64() -> str:
    return _PNG_1x1


def test_schema_validates_severity():
    a = AssessRequest(image="data:image/png;base64,xxx", disaster_type="flood")
    assert a.disaster_type == "flood"


def test_demo_assessment_fallback():
    # Demo provider must return a clearly-labeled fallback, never a fake live result.
    settings.ai_provider = "demo"
    settings.ai_api_key = ""
    req = AssessRequest(image=f"data:image/png;base64,{_dummy_image_b64()}", disaster_type="flood")
    res = asyncio.run(assess(req))
    assert res.provider == "demo"
    assert res.severity == "unclear"
    assert res.status == "needs_human_review"


def test_unknown_provider_falls_back_to_demo():
    settings.ai_provider = "does-not-exist"
    req = AssessRequest(image=f"data:image/png;base64,{_dummy_image_b64()}", disaster_type="earthquake")
    res = asyncio.run(assess(req))
    assert res.provider == "demo"
    assert res.status == "needs_human_review"
