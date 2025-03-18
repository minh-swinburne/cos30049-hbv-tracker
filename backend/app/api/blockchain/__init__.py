from fastapi import APIRouter, HTTPException, status, Depends, Body, Cookie, Header


router = APIRouter(prefix="/blockchain", tags=["Web3 Blockchain"])
# router.include_router(patient.router)
