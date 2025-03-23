from fastapi import APIRouter, HTTPException, status, Body
from app.auth.jwt import create_jwt_token
from app.blockchain import verify_signature
from app.schemas import AuthToken


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/token")
async def generate_access_token(
    address: str = Body(...),
    message: str = Body(...),
    signature: str = Body(...),
) -> AuthToken:
    if not verify_signature(message, signature, address):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature",
        )

    token = create_jwt_token(address)
    return AuthToken(access_token=token, token_type="bearer")
