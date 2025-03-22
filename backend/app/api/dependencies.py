from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import verify_jwt_token
from app.schemas import AuthDetails


bearer_scheme = HTTPBearer()


async def secure_endpoint(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthDetails:
    """
    Validate the access token and return its payload if valid.
    """
    try:
        payload = verify_jwt_token(credentials.credentials)
        if not payload.sub.startswith("0x"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid address",
            )
        return payload
    except Exception as e:
        print("Failed to validate token:", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
