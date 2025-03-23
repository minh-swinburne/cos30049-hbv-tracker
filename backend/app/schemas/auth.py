from pydantic import BaseModel, ConfigDict


class AuthDetails(BaseModel):
    sub: str
    contract: str
    iat: int
    exp: int



class AuthToken(BaseModel):
    access_token: str
    token_type: str
