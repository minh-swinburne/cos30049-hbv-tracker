from fastapi import APIRouter, HTTPException, status, Depends, Body
from app.api.dependencies import secure_endpoint
from app.auth.jwt import create_jwt_token
from app.blockchain import verify_signature
from app.schemas import AuthToken, AuthDetails


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
    return AuthToken(access_token=token, token_type="bearer").model_dump(by_alias=True)


@router.get("/verify")
async def verify_access_token(payload: AuthDetails = Depends(secure_endpoint)) -> bool:
    """
    Verify the access token and return a boolean indicating its validity.

    Args:
        payload (AuthDetails, optional): The current access token. Defaults to Depends(secure_endpoint).

    Returns:
        bool: True if the token is valid, exception will be raised otherwise.
    """
    return True
