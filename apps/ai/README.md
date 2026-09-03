# AI Assessment Service (FastAPI)

Small Python service exposing `POST /assess` for the disaster-damage MVP.

## Endpoints
- `GET /health` — liveness (no secrets)
- `POST /assess` — returns structured severity / confidence / indicators / explanation

## Configure a provider
Set `AI_PROVIDER` to `demo`, `openai`, or `gemini` and supply `AI_API_KEY`.
With `demo` (or no key) the service returns a clearly-labeled fallback so the
demo never hard-fails (spec §53). It never silently fakes a live model response.

## Run locally
```bash
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # set AI_PROVIDER / AI_API_KEY
uvicorn app.main:app --reload --port 8000
```

## Run with Docker
```bash
docker build -t drm04-ai .
docker run -p 8000:8000 --env-file .env drm04-ai
```

## Privacy
Face redaction (`app/services/privacy.py`) uses a pretrained Haar cascade and
blurs detected regions. This is a safety measure, not a guarantee.
