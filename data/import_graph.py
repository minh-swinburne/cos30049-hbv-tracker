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
MERGE (p:Patient {{pid: row.pid}})
SET p.sex = row.sex, p.dob = row.dob, p.ethnic = row.ethnic, p.reg_commune = row.commune_reg, p.reg_district = row.district_reg, p.reg_province = row.province_reg
MERGE (v:Vaccination {{pid: row.pid, name: row.vacname, date: row.vacdate, type: row.vactype}})
MERGE (h:HealthcareProvider {{name: row.vacplace, type: row.vacplace_type}})
MERGE (p)-[:RECEIVED]->(v)
MERGE (v)-[:ADMINISTERED_BY]->(h);
"""


# Connect to Neo4j
def execute_cypher_query(driver, query):
    with driver.session() as session:
        session.run(query)


def clear_neo4j(driver):
    try:
        execute_cypher_query(driver, "MATCH (n) DETACH DELETE n;")
        print("✅ Successfully cleared Neo4j database!")
    except Exception as e:
        print(f"❌ Failed to clear Neo4j database: {e}")


def load_csv_to_neo4j(driver, csv_url):
    print(f"Loading: {csv_url}")
    try:
        query = cypher_query.format(csv_url=csv_url)
        execute_cypher_query(driver, query)
        print(f"✅ Successfully imported: {csv_url}")
    except Exception as e:
        print(f"❌ Failed to import {csv_url}: {e}")


# Main function
def load_chunked_files_to_neo4j(driver, start=1, end=10):
    csv_files = [csv_path_format.format(i=i) for i in range(start, end + 1)]
    for csv_url in csv_files:
        load_csv_to_neo4j(driver, csv_url)
    driver.close()


# Run script
if __name__ == "__main__":
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    # clear_neo4j(driver=driver)
    # load_csv_to_neo4j(driver=driver, csv_url=csv_path_format.format(i=5))
    load_chunked_files_to_neo4j(driver=driver, start=4, end=4)
    print("✅ Done!")
