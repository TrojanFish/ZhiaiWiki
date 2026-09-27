import os
from pydantic import model_validator
from pydantic_settings import BaseSettings

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
    
    # LLM Configuration
    OPENAI_API_KEY: str = DEFAULT_MOCK_OPENAI_KEY
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL_NAME: str = "gpt-4-turbo-preview"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

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
            if not self.OPENAI_API_KEY or self.OPENAI_API_KEY == DEFAULT_MOCK_OPENAI_KEY or self.OPENAI_API_KEY.startswith("sk-mock-"):
                raise ValueError(
                    "[CRITICAL SECURITY ERROR] ZhiaiWiki backend cannot start in production with mock OPENAI_API_KEY! "
                    "You must configure a valid production OPENAI_API_KEY in your environment."
                )
        return self

settings = Settings()
