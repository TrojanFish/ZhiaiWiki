import logging
import os
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

DEFAULT_INSECURE_SECRET = "super_secret_key_for_jwt_which_should_be_changed_in_prod"
DEFAULT_MOCK_OPENAI_KEY = "sk-mock-key-for-development"

class Settings(BaseSettings):
    PROJECT_NAME: str = "ZhiaiWiki"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite+aiosqlite:///./oncopath.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = DEFAULT_INSECURE_SECRET
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Security
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,https://zhiaiwiki.org"

    # Admin credentials for backend admin operations (evidence seeding, etc.)
    # These mirror the Next.js frontend admin credentials for consistency.
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "OncoPath2026!"

    # LLM Configuration (OpenAI-compatible endpoint used by the FastAPI analysis agent)
    # Note: The primary OCR feature uses GEMINI_API_KEY directly from the Next.js frontend.
    OPENAI_API_KEY: str = DEFAULT_MOCK_OPENAI_KEY
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL_NAME: str = "gpt-4-turbo-preview"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

    @model_validator(mode="after")
    def validate_production_security(self):
        env = (self.ENVIRONMENT or os.getenv("NODE_ENV") or os.getenv("ENVIRONMENT") or "development").strip().lower()
        is_production = env in ["production", "prod"]

        if is_production:
            if not self.SECRET_KEY or self.SECRET_KEY == DEFAULT_INSECURE_SECRET or len(self.SECRET_KEY) < 32:
                raise ValueError(
                    "[CRITICAL SECURITY ERROR] ZhiaiWiki backend cannot start in production with default/insecure SECRET_KEY! "
                    "You must provide a high-entropy secret of at least 32 characters via SECRET_KEY environment variable."
                )
            if not self.ADMIN_PASSWORD or self.ADMIN_PASSWORD in ("OncoPath2026!", "ChangeMe_Production_Admin_Password_2026!"):
                raise ValueError(
                    "[CRITICAL SECURITY ERROR] ZhiaiWiki backend cannot start in production with default ADMIN_PASSWORD! "
                    "You must configure a strong ADMIN_PASSWORD in your production environment."
                )
            # Soft-warn about OpenAI key: the primary AI feature uses GEMINI_API_KEY
            # (managed by the Next.js frontend). The backend LLM agent only runs for the
            # /api/analysis/generate endpoint. Log a warning but do not block startup.
            if not self.OPENAI_API_KEY or self.OPENAI_API_KEY == DEFAULT_MOCK_OPENAI_KEY or self.OPENAI_API_KEY.startswith("sk-mock-"):
                logger.warning(
                    "[SECURITY WARNING] ZhiaiWiki backend is running in production with a mock/missing OPENAI_API_KEY. "
                    "The /api/analysis/generate (legacy FastAPI LLM) endpoint will not function. "
                    "If you only use the Next.js Gemini AI pipeline, this warning can be ignored. "
                    "To suppress: set a valid OPENAI_API_KEY in your production environment."
                )
        return self

settings = Settings()
