from app.schemas import AssessRequest, Assessment
from app.services.privacy import redact_faces
from PIL import Image
import io


def _make_image_with_face_placeholder() -> bytes:
    # Solid color image; face detector may or may not trigger. Just exercises the pipeline.
    img = Image.new("RGB", (200, 200), (120, 120, 120))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_redact_returns_bytes():
    out, count = redact_faces(_make_image_with_face_placeholder())
    assert isinstance(out, bytes)
    assert count >= 0


def test_assessment_schema_valid():
    a = Assessment(severity="severe", confidence=0.8, indicators=["debris"],
                   explanation="visible damage", status="assessed")
    assert a.severity == "severe"
