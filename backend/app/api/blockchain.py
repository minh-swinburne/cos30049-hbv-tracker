from fastapi import APIRouter, HTTPException, status, Depends, Body, Path
from app.api.dependencies import secure_endpoint
from app.blockchain import get_contract_address, generate_hash, store_hash, get_hashes
from app.schemas import AuthDetails, EthMessage, VaccinationData, VaccinationAddress


router = APIRouter(prefix="/blockchain", tags=["Web3 Blockchain"])


@router.get("/address")
async def read_contract_address(payload: AuthDetails = Depends(secure_endpoint)):
    """
    Retrieve the address of the deployed smart contract.
    """
    return {"address": get_contract_address()}


@router.post("/store")
async def store_vaccination(
    address: VaccinationAddress = Body(...),
    vaccination: VaccinationData = Body(...),
    message: EthMessage = Body(...),
    signature: str = Body(...),
):
    """
    Store a vaccination record hash on the blockchain.
    """
    data_hash = generate_hash(address, vaccination)
    tx_hash = store_hash(address, data_hash, message, signature)
    return {"tx_hash": tx_hash}


@router.get("/get/{address}")
async def get_vaccination_hashes(
    address: str = Path(...), payload: AuthDetails = Depends(secure_endpoint)
):
    """
    Retrieve vaccination record hashes from the blockchain.
    """
    if payload.sub != address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access: address mismatch",
        )
    data_hash = get_hashes(address)
    return {"data_hash": data_hash}


@router.post("/verify")
async def verify_vaccination(
    tx_hash: str = Body(...),
    address: str = Body(...),
    signature: str = Body(...),
):
    """
    Verify a vaccination record hash on the blockchain.
    """
