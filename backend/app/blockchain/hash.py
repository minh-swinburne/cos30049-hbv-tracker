from web3 import Web3
from app.schemas.vaccination import VaccinationAddress, VaccinationData


def generate_hash(address: VaccinationAddress, vaccination: VaccinationData):
    """Create a SHA-256 hash of vaccination details linked to patient's and healthcare provider's wallet addresses."""
    data_string = f"{address.patient}{address.healthcare_provider}{vaccination.name}{vaccination.date}{vaccination.type}"
    return "0x" + Web3.keccak(text=data_string).hex()


if __name__ == "__main__":
    from datetime import date

    address = VaccinationAddress(
        patient="0x4ca32d107c8BF5481aA8EE9C0d287F7F5aDe62EE",
        healthcare_provider="0xD607C8B31cD9DFEBa82DaC425e69B126B24eD2F3",
    )
    vaccination = VaccinationData(
        name="Hexaxim",
        date=date(2022, 1, 1),
        type="TCMR",
    )
    print(generate_hash(address, vaccination))
