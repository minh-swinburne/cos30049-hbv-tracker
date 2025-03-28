from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.settings import settings
from app.auth.jwt import verify_jwt_token
from app.schemas import AuthDetails


bearer_scheme = HTTPBearer()


async def secure_endpoint(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthDetails:
    """
    Validate the access token and return its payload if valid.

    - Ensures the token contains a valid Ethereum address and contract address.
    - Verifies the token's contract address matches the application's contract address.
    """
    try:
        payload = verify_jwt_token(credentials.credentials)
        if not payload.sub.startswith("0x"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid address",
            )
        if not payload.contract.startswith("0x"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid contract address",
            )
        if payload.contract != settings.contract_address:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect contract address",
            )
        return payload
    except Exception as e:
        print("Failed to validate token:", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
