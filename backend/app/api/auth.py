from fastapi import APIRouter, HTTPException, status, Depends, Body, Header
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.settings import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    return JSONResponse(content={"message": "Hello World"}, status_code=status.HTTP_200_OK)
    # user = await authenticate_user(db, form_data.username, form_data.password)
    # if not user:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Incorrect username or password",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    # access_token = create_access_token(data={"sub": user.username})
    # return {"access_token": access_token, "token_type": "bearer"}
