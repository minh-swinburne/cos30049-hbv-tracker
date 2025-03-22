from pydantic import BaseModel, ConfigDict
from datetime import date


class VaccinationData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str                   # Name of the vaccine
    date: date                  # Date of vaccination
    type: str                   # Type of vaccination


class VaccinationAddress(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient: str                # Wallet address of the patient
    healthcare_provider: str    # Wallet address of the healthcare provider
