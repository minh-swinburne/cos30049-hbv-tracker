from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.api.dependencies import secure_endpoint
from app.core.graph import AsyncDriver, get_driver, map_node, extract_graph_data
from app.schemas import AuthDetails, GraphData, GraphLink
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
    limit: int = Query(10, ge=1, le=1000),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphData:
    """Fetch all nodes and relationships from the graph database."""

    cypher_query = f"""
        MATCH r=(:Patient)-[:RECEIVED]->(:Vaccination)-[:ADMINISTERED_BY]->(:HealthcareProvider)
        RETURN r LIMIT {limit}
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()
        return extract_graph_data(data)


@router.get("/hop")
async def read_node_hop(
    id: str = Query(...),
    type: str = Query(...),
    address: str = Query(...),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphData:
    """Fetch nodes and relationships from the graph database related to a node."""

    if type == "Patient":
        condition = ":Patient {pid: '%s'}" % id
    elif type == "Vaccination":
        pid, name, date = id.split("_")
        condition = ":Vaccination {pid: '%s', name: '%s', date: '%s'}" % (
            pid,
            name,
            date,
        )
    elif type == "HealthcareProvider":
        type, name = id.split("_")
        condition = ":HealthcareProvider {type: '%s', name: '%s'}" % (type, name)
    elif address is not None:
        condition = f" {{wallet: '{address}'}}"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid node type or no address provided",
        )

    cypher_query = f"""
        MATCH (n{condition})
        OPTIONAL MATCH (n)-[r_out]->(n_target)
        OPTIONAL MATCH (n)<-[r_in]-(n_source)
        RETURN
            n AS node,
            collect(DISTINCT r_out) as out,
            collect(DISTINCT r_in) as in,
            collect(DISTINCT n_target) as target,
            collect(DISTINCT n_source) as source
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()
        graph = GraphData(
            nodes=[],
            links=[],
            root=None,
        )

        for record in data:
            node = record.get("node")
            out = record.get("out")
            in_ = record.get("in")

            node = map_node(node)
            graph.nodes.append(node)
            graph.root = node

            for link in out:
                target = map_node(link[2])
                graph.nodes.append(target)
                graph.links.append(
                    GraphLink(source=node.id, target=target.id, type=link[1])
                )
            for link in in_:
                source = map_node(link[0])
                graph.nodes.append(source)
                graph.links.append(
                    GraphLink(source=source.id, target=node.id, type=link[1])
                )

        return graph


@router.get("/search")
async def search_graph_db(
    query: str = Query(...),
    driver: AsyncDriver = Depends(get_driver),
    payload: AuthDetails = Depends(secure_endpoint),
) -> GraphData:
    """Search the graph database for nodes matching the given query."""

    cypher_query = f"""
        CALL () {{
            MATCH r1=(n:Patient {{wallet: '{query}'}})-[:RECEIVED]->(:Vaccination)-[:ADMINISTERED_BY]->(:HealthcareProvider)
            RETURN r1 AS r, n
        }}
        RETURN r, n
        UNION
        CALL () {{
            MATCH r2=(:Patient)-[:RECEIVED]->(n:Vaccination {{tx_hash: '{query}'}})-[:ADMINISTERED_BY]->(:HealthcareProvider)
            RETURN r2 AS r, n
        }}
        RETURN r, n
        UNION
        CALL () {{
            MATCH r3=(:Patient)-[:RECEIVED]->(:Vaccination)-[:ADMINISTERED_BY]->(n:HealthcareProvider {{wallet: '{query}'}})
            RETURN r3 AS r, n
        }}
        RETURN r, n
    """

    async with driver.session() as session:
        result = await session.run(cypher_query)
        data = await result.data()
        return extract_graph_data(data)
