from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timezone
from app.core.settings import settings
from app.schemas import AuthDetails
from app.utils import parse_timedelta


def create_jwt_token(address: str) -> str:
    """Generates a JWT token for authenticated users."""
    expires_delta = parse_timedelta(settings.jwt_access_expires_in)
    payload = {
        "sub": address,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + expires_delta,
    }
    return jwt.encode(
        payload, key=settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )


def verify_jwt_token(token: str) -> AuthDetails:
    """Verifies a JWT token and returns the address of the user."""
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return AuthDetails.model_validate(payload)
    except ExpiredSignatureError:
        raise ExpiredSignatureError("Token has expired")
    except JWTError:
        raise JWTError("Invalid token")
