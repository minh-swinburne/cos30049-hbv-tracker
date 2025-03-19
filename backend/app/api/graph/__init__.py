from fastapi import APIRouter, HTTPException, status, Depends, Body, Cookie, Header
from app.core.graph import AsyncGraphDatabase, get_driver
from . import patient


router = APIRouter(prefix="/graph", tags=["Neo4j Graph Database"])
router.include_router(patient.router)


@router.get("/address")
async def read_graph_db_address(driver: AsyncGraphDatabase = Depends(get_driver)):
    server_info = await driver.get_server_info()
    return {"address": server_info.address}


@router.get("/health")
async def read_graph_db_health(driver: AsyncGraphDatabase = Depends(get_driver)):
    health = await driver.get_health()
    return {"status": health.status}


@router.get("/all")
async def read_graph_db_all(driver: AsyncGraphDatabase = Depends(get_driver)):
    """Fetch nodes and relationships for graph visualization."""
    query = """
    MATCH (p:Patient)-[:RECEIVED]->(v:Vaccination)-[:ADMINISTERED_BY]->(h:HealthcareProvider)
    RETURN p.wallet AS patient, v.name AS vaccine, h.name AS provider
    """
    result = driver.execute_query(query)
    data = [
        {"patient": r["patient"], "vaccine": r["vaccine"], "provider": r["provider"]}
        for r in result
    ]
    return {"graph": data}
