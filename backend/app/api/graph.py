from fastapi import APIRouter, HTTPException, status, Depends, Body, Cookie, Header
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from neo4j import AsyncGraphDatabase
from app.core.graph import get_driver

router = APIRouter(prefix="/graph", tags=["Neo4j Graph Database"])


@router.get("/address")
async def read_graph_db_address(driver: AsyncGraphDatabase = Depends(get_driver)):
    server_info = await driver.get_server_info()
    return {"address": server_info.address}
