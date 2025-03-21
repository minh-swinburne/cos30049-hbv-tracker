from fastapi import APIRouter, HTTPException, status, Depends, Body, Path, Header
from app.blockchain.transactions import store_vaccination, get_vaccination


router = APIRouter(prefix="/blockchain", tags=["Web3 Blockchain"])


@router.post("/store")
async def store_vaccination_hash(
    address: str = Body(...),
    data_hash: str = Body(...),
    signature: str = Body(...),
):
    """
    Store a vaccination record hash on the blockchain.
    """
    tx_hash = store_vaccination(address, data_hash, signature)
    return {"tx_hash": tx_hash}


@router.get("/get/{address}")
async def get_vaccination_hashes(address: str = Path(...)):
    """
    Retrieve vaccination record hashes from the blockchain.
    """
    data_hash = get_vaccination(address)
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

