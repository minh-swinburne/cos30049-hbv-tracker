from fastapi import APIRouter, HTTPException, status, Depends, Body, Path
from app.api.dependencies import secure_endpoint
from app.core.graph import AsyncDriver, get_driver, extract_graph_data
from app.blockchain import get_deployer_address
from app.schemas import AuthDetails, GraphData, GraphHealthcareProvider


router = APIRouter(prefix="/provider")


@router.get("/{address}")
async def read_provider(
    address: str = Path(..., title="Healthcare Provider's Wallet Address"),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphHealthcareProvider:
    """Fetch a healthcare provider node from the graph database."""
    if payload.sub != address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access: address mismatch",
        )

    cypher_query = f"""
        MATCH (h:HealthcareProvider {{wallet: '{address}'}})
        RETURN h
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()

        if len(data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Healthcare provider not found in the graph database",
            )
        return GraphHealthcareProvider.model_validate(data[0].get("h"))


@router.get("/{address}/records")
async def read_provider_vaccinations(
    address: str = Path(..., title="Healthcare Provider's Wallet Address"),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphData:
    """Fetch a healthcare provider's vaccination records from the graph database."""
    if payload.sub != address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access: address mismatch",
        )

    cypher_query = f"""
        MATCH r=(:Patient)-[:RECEIVED]->(:Vaccination)-[:ADMINISTERED_BY]->(n:HealthcareProvider {{wallet: '{address}'}})
        RETURN r, n
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()

        if len(data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Healthcare provider not found in the graph database",
            )
        return extract_graph_data(data)


@router.post("/create")
async def create_provider(
    healthcare_provider: GraphHealthcareProvider  = Body(...),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphHealthcareProvider:
    """Create a new healthcare provider node (if not exists) in the graph database."""
    # Check if payload.sub is admin
    if not payload.sub != get_deployer_address():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access: admin required",
        )

    cypher_query = f"""
    MERGE (h:HealthcareProvider {{name: '{healthcare_provider.name}', type: '{healthcare_provider.type}'}})
    SET h.wallet = '{healthcare_provider.wallet}'
    RETURN h
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()
        return GraphHealthcareProvider.model_validate(data[0].get("h"))
