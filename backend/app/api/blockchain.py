from fastapi import APIRouter, HTTPException, status, Depends, Body, Path, Query
from app.api.dependencies import secure_endpoint
from app.blockchain import *
from app.schemas import AuthDetails, VaccinationData, VaccinationAddress
from app.schemas.eth import *


router = APIRouter(prefix="/blockchain", tags=["Web3 Blockchain"])


@router.get("/address")
async def read_contract_address(payload: AuthDetails = Depends(secure_endpoint)) -> EthAddress:
    """
    Retrieve the address of the deployed smart contract.
    """
    return EthAddress(address=get_contract_address())


@router.get("/admin")
async def read_admin_address(payload: AuthDetails = Depends(secure_endpoint)) -> EthAddress:
    """
    Retrieve the address of the contract owner.
    """
    return EthAddress(address=get_deployer_address())


@router.get("/provider/{address}")
async def check_provider_registration(
    address: str = Path(...),
    payload: AuthDetails = Depends(secure_endpoint),
):
    """
    Check if a healthcare provider is registered on the blockchain.
    """
    return {"authorized": is_authorized_healthcare_provider(address)}


@router.get("/researcher/{address}")
async def check_researcher_registration(
    address: str = Path(...),
    payload: AuthDetails = Depends(secure_endpoint),
):
    """
    Check if a researcher is registered on the blockchain.
    """
    return {"authorized": is_authorized_researcher(address)}


@router.post("/store")
async def store_vaccination(
    address: VaccinationAddress = Body(...),
    vaccination: VaccinationData = Body(...),
    message: EthMessage = Body(...),
    signature: str = Body(...),
) -> EthHash:
    """
    Store a vaccination record hash on the blockchain.
    """
    data_hash = generate_hash(address, vaccination)
    tx_hash = store_hash(address, data_hash, message, signature)

    return EthHash(data_hash=data_hash, tx_hash=tx_hash).model_dump(by_alias=True)


@router.get("/get/{address}")
async def get_vaccination_hashes(
    address: str = Path(...), payload: AuthDetails = Depends(secure_endpoint)
) -> list[EthRecord]:
    """
    Retrieve vaccination record hashes from the blockchain.
    """
    if payload.sub != address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access: address mismatch",
        )

    records = get_hashes(address)
    return [record.model_dump(by_alias=True) for record in records]


@router.get("/verify/{address}")
async def verify_vaccination_hash(
    address: str = Path(...),
    tx_hash: str = Query(...),
) -> EthHash:
    """
    Verify a vaccination record hash on the blockchain.
    """
    try:
        data_hash = verify_transaction(address, tx_hash)
        EthHash(data_hash=data_hash, tx_hash=tx_hash).model_dump(by_alias=True)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
