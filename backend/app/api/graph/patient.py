from fastapi import APIRouter, HTTPException, status, Depends, Body, Path
from app.api.dependencies import secure_endpoint
from app.core.graph import AsyncDriver, get_driver, extract_graph_data
from app.blockchain import is_authorized_healthcare_provider
from app.schemas import AuthDetails, GraphData, GraphPatient


router = APIRouter(prefix="/patient")


@router.get("/{pid}")
async def read_patient(
    pid: str = Path(..., title="Patient ID"),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphPatient:
    """Fetch a patient node from the graph database."""
    cypher_query = f"""
        MATCH (p:Patient {{pid: '{pid}'}})
        RETURN p
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()

        if len(data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found in the graph database",
            )

        patient = GraphPatient.model_validate(data[0].get("p"))

        if payload.sub != patient.wallet:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Unauthorized access: address mismatch. Expected: {patient.wallet}, Got: {payload.sub}",
            )

        return patient.model_dump(by_alias=True)


@router.get("/{address}/records")
async def read_patient_vaccinations(
    address: str = Path(..., title="Patient's Wallet Address"),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphData:
    """Fetch a patient's vaccination records from the graph database."""
    if payload.sub != address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access: address mismatch",
        )

    cypher_query = f"""
        MATCH r=(n:Patient {{wallet: '{address}'}})-[:RECEIVED]->(:Vaccination)-[:ADMINISTERED_BY]->(:HealthcareProvider)
        RETURN r, n
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()

        if len(data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient records not found in the graph database",
            )
        return extract_graph_data(data)


@router.post("/create")
async def create_patient(
    patient: GraphPatient = Body(...),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphPatient:
    """Create a new patient node (if not exists) in the graph database."""
    # Check if payload.sub is an authorized healthcare provider
    if not is_authorized_healthcare_provider(payload.sub):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access: healthcare provider only",
        )

    cypher_query = f"""
    MERGE (p:Patient {{pid: '{patient.pid}'}})
    SET p.wallet = '{patient.wallet}', p.sex = '{patient.sex}', p.dob = '{patient.dob}', p.ethnic = '{patient.ethnic}', p.reg_province = '{patient.reg_province}', p.reg_district = '{patient.reg_district}', p.reg_commune = '{patient.reg_commune}'
    RETURN p
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()

        return GraphPatient.model_validate(data[0].get("p")).model_dump(by_alias=True)
