from neo4j import GraphDatabase

# Neo4j connection details
NEO4J_URI = "neo4j+s://d8af6d58.databases.neo4j.io"  # Change to your Neo4j instance
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "cO0PNP_Kq14TGtkE3c6BrcwlF25aAkHsydFFjF1_s3c"

# List of chunked CSV files (update with your GitHub raw URLs)
csv_path_format = "https://raw.githubusercontent.com/minh-swinburne/cos30049-hbv-tracker/refs/heads/full/data/data/chunked_data_{i}.csv"

# Cypher Query Template
cypher_query = """
LOAD CSV WITH HEADERS FROM '{csv_url}' AS row
MERGE (p:Patient {pid: row.pid})
MERGE (v:Vaccination {name: row.vacname, date: row.vacdate, type: row.vactype})
MERGE (h:HealthcareProvider {name: row.vacplace, type: row.vacplace_type})
MERGE (r:Region {province: row.province_reg, district: row.district_reg, commune: row.commune_reg})
MERGE (p)-[:RECEIVED]->(v)
MERGE (v)-[:ADMINISTERED_BY]->(h)
MERGE (h)-[:LOCATED_IN]->(r);
"""


# Connect to Neo4j
def execute_cypher_query(driver, query):
    with driver.session() as session:
        session.run(query)


# Main function
def load_csvs_to_neo4j():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    csv_files = [csv_path_format.format(i=i) for i in range(1, 11)]
    for csv_url in csv_files:
        print(f"Loading: {csv_url}")
        try:
            query = cypher_query.format(csv_url=csv_url)
            execute_cypher_query(driver, query)
            print(f"✅ Successfully imported: {csv_url}")
        except Exception as e:
            print(f"❌ Failed to import {csv_url}: {e}")
    driver.close()


# Run script
if __name__ == "__main__":
    load_csvs_to_neo4j()
