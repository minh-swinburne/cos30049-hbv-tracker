from fastapi import APIRouter, HTTPException, status, Depends
from app.api.dependencies import secure_endpoint
from app.core.graph import AsyncDriver, get_driver, extract_graph_data
from app.schemas import AuthDetails, GraphData
from . import patient
from . import provider
from . import vaccination


router = APIRouter(prefix="/graph", tags=["Neo4j Graph Database"])
router.include_router(patient.router)
router.include_router(provider.router)
router.include_router(vaccination.router)


@router.get("/address")
async def read_graph_db_address(
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
):
    """Retrieve the address of the Neo4j graph database."""
    server_info = await driver.get_server_info()
    return {"address": server_info.address}


@router.get("/all")
async def read_graph_db_all(
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphData:
    """Fetch all nodes and relationships from the graph database."""

    cypher_query = """
        MATCH r=(:Patient)-[:RECEIVED]->(:Vaccination)-[:ADMINISTERED_BY]->(:HealthcareProvider)
        RETURN r LIMIT 10
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()
        return extract_graph_data(data)
