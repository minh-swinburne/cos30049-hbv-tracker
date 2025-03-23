from neo4j import GraphDatabase, AsyncGraphDatabase, AsyncDriver
from app.core.settings import settings
from app.schemas.graph import *
from typing import AsyncGenerator, Any


URI = settings.neo4j_uri
USER = settings.neo4j_user
PASSWORD = settings.neo4j_password
AUTH = (USER, PASSWORD)


async def get_driver() -> AsyncGenerator[AsyncDriver, Any]:
    async with AsyncGraphDatabase.driver(URI, auth=AUTH) as driver:
        yield driver


def setup_graph_db():
    try:
        with GraphDatabase.driver(URI, auth=AUTH) as driver:
            driver.verify_connectivity()
            with driver.session() as session:
                result = session.run("MATCH (n) RETURN count(n)")
                print("✅ Connected to Neo4j instance. Node count:", result.single()[0])
    except Exception as e:
        print("❌ Failed to connect to Neo4j:", e)


def extract_graph_data(data: list[dict[str]]) -> GraphData:
    """Extract graph data from a list of records."""
    graph_data = GraphData(
        nodes=[],
        links=[],
    )

    for record in data:
        chain: list = record.get("r")
        patient = GraphPatient.model_validate(chain[0])
        vaccination = GraphVaccination.model_validate(chain[2])
        healthcare_provider = GraphHealthcareProvider.model_validate(chain[4])

        patient_id = patient.pid
        vaccination_id = f"{vaccination.pid}_{vaccination.name}_{vaccination.date}"
        healthcare_provider_id = (
            f"{healthcare_provider.type}_{healthcare_provider.name}"
        )

        graph_data.nodes.extend(
            [
                GraphNode(id=patient_id, type="Patient", data=patient),
                GraphNode(
                    id=vaccination_id,
                    type="Vaccination",
                    data=vaccination,
                ),
                GraphNode(
                    id=healthcare_provider_id,
                    type="HealthcareProvider",
                    data=healthcare_provider,
                ),
            ]
        )

        graph_data.links.extend(
            [
                GraphLink(source=patient_id, target=vaccination_id, type="RECEIVED"),
                GraphLink(
                    source=vaccination_id,
                    target=healthcare_provider_id,
                    type="ADMINISTERED_BY",
                ),
            ]
        )

    return graph_data
