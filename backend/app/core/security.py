import hashlib
import hmac
import secrets
import time
from collections import defaultdict
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
from app.core.config import settings

PBKDF2_ITERATIONS = 210000
DKLEN = 64
HASH_ALGORITHM = "sha512"

# Fallback bcrypt context for backward compatibility with existing databases
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory rate limiting tracker: identifier -> list of timestamp floats
_failed_attempts: dict[str, list[float]] = defaultdict(list)

def validate_password_strength(password: str) -> tuple[bool, str | None]:
    """Validate password against OWASP security rules."""
    if not password or len(password) < 8:
        return False, "密码长度至少需要 8 个字符"
    if len(password) > 128:
        return False, "密码长度不能超过 128 个字符"
    
    common_weak_passwords = {
        "12345678", "password", "123456789", "qwertyuiop", "admin123",
        "11111111", "12344321", "password123", "root1234", "zhiaiwiki"
    }
    if password.lower() in common_weak_passwords:
        return False, "密码过于简单，请使用包含字母、数字或特殊字符的强密码"
    
    return True, None

def check_login_rate_limit(identifier: str, max_attempts: int = 5, window_seconds: int = 300) -> bool:
    """Check if identifier (e.g. IP or email) has exceeded failed attempt threshold."""
    now = time.time()
    attempts = _failed_attempts[identifier]
    # Prune expired timestamps
    _failed_attempts[identifier] = [t for t in attempts if now - t < window_seconds]
    return len(_failed_attempts[identifier]) < max_attempts

def record_failed_login(identifier: str) -> None:
    _failed_attempts[identifier].append(time.time())

def reset_login_attempts(identifier: str) -> None:
    _failed_attempts.pop(identifier, None)

def get_password_hash(password: str) -> str:
    """Generate OWASP-compliant PBKDF2-SHA512 password hash with 210,000 rounds and random salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        HASH_ALGORITHM,
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
        dklen=DKLEN
    )
    return f"pbkdf2_sha512${PBKDF2_ITERATIONS}${salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against PBKDF2 hash or legacy bcrypt hash."""
    if not hashed_password or not plain_password:
        return False

    # 1. Modern PBKDF2 with embedded salt: pbkdf2_sha512$<iterations>$<salt>$<hash>
    if hashed_password.startswith("pbkdf2_sha512$"):
        try:
            parts = hashed_password.split("$")
            if len(parts) == 4:
                _, iter_str, salt, expected_hex = parts
                iterations = int(iter_str)
                computed_key = hashlib.pbkdf2_hmac(
                    HASH_ALGORITHM,
                    plain_password.encode("utf-8"),
                    salt.encode("utf-8"),
                    iterations,
                    dklen=DKLEN
                )
                return hmac.compare_digest(computed_key.hex(), expected_hex)
        except Exception:
            return False

    # 2. Legacy bcrypt compatibility
    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            return bcrypt_context.verify(plain_password, hashed_password)
        except Exception:
            return False

    return False

def needs_rehash(hashed_password: str) -> bool:
    """Check if stored hash needs upgrade to latest PBKDF2 210,000 rounds."""
    if not hashed_password:
        return True
    if not hashed_password.startswith(f"pbkdf2_sha512${PBKDF2_ITERATIONS}$"):
        return True
    return False

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
