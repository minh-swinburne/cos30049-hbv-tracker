from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class AuthDetails(BaseModel):
    sub: str
    contract: str
    iat: int
    exp: int


class AuthToken(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, alias_generator=to_camel, populate_by_name=True
    )

    access_token: str
    token_type: str
