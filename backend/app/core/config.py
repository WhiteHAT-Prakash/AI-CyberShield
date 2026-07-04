from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables.
    Never hardcode secrets — always use .env or deployment secrets manager.
    """

    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Google Gemini AI
    GEMINI_API_KEY: str

    # n8n webhook
    N8N_WEBHOOK_URL: str = ""

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


# Singleton settings instance — import this everywhere
settings = Settings()
