from neo4j import GraphDatabase, AsyncGraphDatabase
from app.core.settings import settings
from typing import AsyncGenerator, Any


URI = settings.neo4j_uri
USER = settings.neo4j_user
PASSWORD = settings.neo4j_password
AUTH = (USER, PASSWORD)


async def get_driver() -> AsyncGenerator[AsyncGraphDatabase, Any]:
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
