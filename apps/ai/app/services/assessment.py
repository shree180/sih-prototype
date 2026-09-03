"""Vision assessment dispatcher.

Provider strategy (spec 8.4 / 15): pick ONE vision-capable LLM provider.
A `demo` provider returns a clearly-labeled fallback so the demo never hard-fails.
"""
import time
import base64
import json
import httpx

from app.config import settings
from app.schemas import AssessRequest, AssessResponse, Assessment
from app.prompts import SYSTEM_PROMPT


def _decode_image(req: AssessRequest) -> bytes:
    raw = req.image
    if raw.startswith("data:"):
        raw = raw.split(",", 1)[1]
    return base64.b64decode(raw)


def _finalize(assessment: Assessment, provider: str, model: str, elapsed_ms: int) -> AssessResponse:
    status = assessment.status
    if status == "assessed" and (
        assessment.severity == "unclear"
        or assessment.confidence < settings.confidence_threshold
    ):
        status = "needs_human_review"
    return AssessResponse(
        severity=assessment.severity,
        confidence=assessment.confidence,
        indicators=assessment.indicators,
        explanation=assessment.explanation,
        status=status,
        provider=provider,
        model_name=model,
        model_version=settings.ai_model_version,
        processing_time_ms=elapsed_ms,
    )


def _demo_assessment(req: AssessRequest) -> Assessment:
    # Deterministic, clearly-labeled fallback. NOT a live model response.
    return Assessment(
        severity="unclear",
        confidence=0.0,
        indicators=[],
        explanation=(
            "Demo provider active: no live vision model configured. "
            "This is a clearly-labeled fallback assessment; human review required."
        ),
        status="needs_human_review",
    )


def _parse_json(content: str) -> dict:
    # tolerate code fences
    content = content.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.lstrip().startswith("json"):
            content = content.lstrip()[4:]
    return json.loads(content)


async def _openai_assess(req: AssessRequest) -> Assessment:
    b64 = base64.b64encode(_decode_image(req)).decode()
    payload = {
        "model": settings.ai_model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text",
                     "text": f"Disaster type: {req.disaster_type}. "
                             f"Citizen description: {req.description or 'none'}"},
                    {"type": "image_url",
                     "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                ],
            },
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
    }
    base = settings.ai_base_url or "https://api.openai.com/v1"
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            f"{base}/chat/completions",
            headers={"Authorization": f"Bearer {settings.ai_api_key}",
                     "Content-Type": "application/json"},
            json=payload,
        )
        r.raise_for_status()
        content = r.json()["choices"][0]["message"]["content"]
    data = _parse_json(content)
    return Assessment(**data)


async def _gemini_assess(req: AssessRequest) -> Assessment:
    b64 = base64.b64encode(_decode_image(req)).decode()
    payload = {
        "contents": [{
            "parts": [
                {"text": SYSTEM_PROMPT + f"\nDisaster type: {req.disaster_type}."},
                {"inline_data": {"mime_type": "image/jpeg", "data": b64}},
            ]
        }],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"},
    }
    base = settings.ai_base_url or "https://generativelanguage.googleapis.com/v1beta"
    url = f"{base}/models/{settings.ai_model}:generateContent?key={settings.ai_api_key}"
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        content = r.json()["candidates"][0]["content"]["parts"][0]["text"]
    data = _parse_json(content)
    return Assessment(**data)


async def assess(req: AssessRequest) -> AssessResponse:
    start = time.time()
    provider = settings.ai_provider

    try:
        if provider == "demo" or not settings.ai_api_key:
            assessment = _demo_assessment(req)
            provider_name = "demo"
            model_name = settings.ai_model
        elif provider == "openai":
            assessment = await _openai_assess(req)
            provider_name = "openai"
            model_name = settings.ai_model
        elif provider == "gemini":
            assessment = await _gemini_assess(req)
            provider_name = "gemini"
            model_name = settings.ai_model
        else:
            assessment = _demo_assessment(req)
            provider_name = "demo"
            model_name = settings.ai_model
    except Exception as e:
        # AI failure fallback (spec 53): keep report visible, route to human review.
        assessment = Assessment(
            severity="unclear", confidence=0.0, indicators=[],
            explanation=f"Assessment service error ({type(e).__name__}); routed to human review.",
            status="processing_failed",
        )
        provider_name = provider
        model_name = settings.ai_model

    elapsed_ms = int((time.time() - start) * 1000)
    return _finalize(assessment, provider_name, model_name, elapsed_ms)
