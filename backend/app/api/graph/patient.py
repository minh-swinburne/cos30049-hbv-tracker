from fastapi import APIRouter, HTTPException, status, Depends, Body, Path, Header
from app.core.graph import AsyncGraphDatabase, get_driver


router = APIRouter(prefix="/patient", tags=["Patient"])


@router.get("/address")
async def read_graph_db_address(driver: AsyncGraphDatabase = Depends(get_driver)):
    server_info = await driver.get_server_info()
    return {"address": server_info.address}
