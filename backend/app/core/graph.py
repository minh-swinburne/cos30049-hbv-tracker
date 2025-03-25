from neo4j import GraphDatabase, AsyncGraphDatabase, AsyncDriver
from app.core.settings import settings
from app.schemas.graph import *
from typing import AsyncGenerator, Any
from app.core.logging import setup_logging

logger = setup_logging()

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
                logger.info(
                    f"Connected to Neo4j instance. Node count: {result.single()[0]}"
                )
    except Exception as e:
        logger.error(f"Failed to connect to Neo4j: {e}", exc_info=True)
        raise


def map_node(node: dict) -> GraphNode:
    if node.get("ethnic") is not None:
        id = node.get("pid")
        type = "Patient"
        data = GraphPatient.model_validate(node)
    elif node.get("date") is not None:
        id = f"{node.get('pid')}_{node.get('name')}_{node.get('date')}"
        type = "Vaccination"
        data = GraphVaccination.model_validate(node)
    elif node.get("type") is not None:
        id = f"{node.get('type')}_{node.get('name')}"
        type = "HealthcareProvider"
        data = GraphHealthcareProvider.model_validate(node)
    else:
        raise ValueError("Invalid node type:", node)
    return GraphNode(id=id, type=type, data=data.model_dump(by_alias=True))


def extract_graph_data(data: list[dict[str]]) -> GraphData:
    """Extract graph data from a list of records. The input needs to be the result from this Cypher query:
    MATCH r=(:Patient)-[:RECEIVED]->(:Vaccination)-[:ADMINISTERED_BY]->(:HealthcareProvider)

    If `n` is included in the cypher query and the result, it will be treated as the root node.
    """
    graph_data = GraphData(nodes=[], links=[], root=None)
    unique_ids = set()

    for record in data:
        root: dict = record.get("n")
        if root is not None:
            graph_data.root = map_node(root)

        chain: list = record.get("r")
        patient = GraphPatient.model_validate(chain[0])
        vaccination = GraphVaccination.model_validate(chain[2])
        healthcare_provider = GraphHealthcareProvider.model_validate(chain[4])

        patient_id = patient.pid
        vaccination_id = f"{vaccination.pid}_{vaccination.name}_{vaccination.date}"
        healthcare_provider_id = (
            f"{healthcare_provider.type}_{healthcare_provider.name}"
        )

        for node in [
            GraphNode(
                id=patient_id, type="Patient", data=patient.model_dump(by_alias=True)
            ),
            GraphNode(
                id=vaccination_id,
                type="Vaccination",
                data=vaccination.model_dump(by_alias=True),
            ),
            GraphNode(
                id=healthcare_provider_id,
                type="HealthcareProvider",
                data=healthcare_provider.model_dump(by_alias=True),
            ),
        ]:
            if node.id not in unique_ids:
                graph_data.nodes.append(node)
                unique_ids.add(node.id)

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
