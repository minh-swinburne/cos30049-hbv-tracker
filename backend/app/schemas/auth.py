from pydantic import BaseModel, ConfigDict


class AuthDetails(BaseModel):
    sub: str
    iat: int
    exp: int
    


class AuthToken(BaseModel):
    access_token: str
    token_type: str


class EthMessage(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    domain: dict
    message: dict
    primaryType: str
    types: dict
