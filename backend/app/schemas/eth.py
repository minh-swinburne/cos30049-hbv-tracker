from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class EthMessage(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    domain: dict
    message: dict
    primaryType: str
    types: dict


class EthAddress(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, alias_generator=to_camel, populate_by_name=True
    )

    address: str


class EthHash(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, alias_generator=to_camel, populate_by_name=True
    )

    data_hash: str
    tx_hash: str


class EthRecord(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, alias_generator=to_camel, populate_by_name=True
    )

    data_hash: str
    timestamp: int
