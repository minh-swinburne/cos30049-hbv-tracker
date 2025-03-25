from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, Union


class GraphPatient(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pid: str
    wallet: Optional[str] = None
    sex: str
    dob: date
    ethnic: str
    reg_province: str
    reg_district: str
    reg_commune: str


class GraphHealthcareProvider(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    wallet: Optional[str] = None
    name: str
    type: str


class GraphVaccination(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pid: str
    name: str
    date: date
    type: str
    data_hash: Optional[str] = None
    tx_hash: Optional[str] = None


class GraphNode(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str
    data: Union[GraphPatient, GraphHealthcareProvider, GraphVaccination]


class GraphLink(BaseModel):
    source: str
    target: str
    type: str


class GraphData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nodes: list[GraphNode]
    links: list[GraphLink]
    root: Optional[GraphNode]
