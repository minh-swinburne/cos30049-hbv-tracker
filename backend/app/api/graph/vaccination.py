from fastapi import APIRouter, HTTPException, status, Depends, Body, Path
from app.api.dependencies import secure_endpoint
from app.core.graph import AsyncDriver, get_driver
from app.schemas import AuthDetails, GraphVaccination, GraphHealthcareProvider


router = APIRouter(prefix="/vaccination")


@router.get("/{tx_hash}")
async def read_vaccinations(
    tx_hash: str = Path(..., title="Vaccination Transaction Hash"),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphVaccination:
    """Fetch a single vaccination record from the graph database."""
    cypher_query = f"""
        MATCH (v:Vaccination {{tx_hash: '{tx_hash}'}})
        RETURN v
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()

        if len(data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vaccination not found in the graph database",
            )
        return GraphVaccination.model_validate(data[0].get("v"))


@router.post("/create")
async def create_vaccination(
    vaccination: GraphVaccination = Body(...),
    healthcare_provider: GraphHealthcareProvider = Body(...),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
):
    """Create a new vaccination node (if not exists) in the graph database."""
    # Check if payload.sub is an authorized healthcare provider

    cypher_query = f"""
    MATCH (p:Patient {{pid: '{vaccination.pid}'}})
    MATCH (h:HealthcareProvider {{name: '{healthcare_provider.name}', type: '{healthcare_provider.type}'}})
    MERGE (v:Vaccination {{pid: '{vaccination.pid}', name: '{vaccination.name}', date: '{vaccination.date}', type: '{vaccination.type}'}})
    SET v.data_hash = '{vaccination.data_hash}', v.tx_hash = '{vaccination.tx_hash}'
    MERGE (p)-[:RECEIVED]->(v)
    MERGE (v)-[:ADMINISTERED_BY]->(h)
    RETURN v
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()
        return GraphVaccination.model_validate(data[0].get("v"))
