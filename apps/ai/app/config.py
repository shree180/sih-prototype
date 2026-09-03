from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ai_provider: str = "demo"          # demo | openai | gemini
    ai_api_key: str = ""
    ai_model: str = "demo-vision-1"
    ai_model_version: str = "1.0"
    ai_base_url: str = ""
    ai_service_key: str = ""  # Shared key required by /assess and /redact when configured.
    confidence_threshold: float = 0.60  # below this -> needs_human_review

    environment: str = "development"


settings = Settings()
