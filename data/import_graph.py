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


def load_custom_data_to_neo4j(driver):
    pid = "481198892932932"
    patient_wallet = "0x4ca32d107c8BF5481aA8EE9C0d287F7F5aDe62EE"
    v1_data_hash = "0x2cd7a0c0fa622509b6ef40185a69548bd233034c0473ca304981982c7d352a0e"
    v1_tx_hash = "0xf364a7f947a13fc09b4fa86f0c8feacebfbb5313ef2d0c7bf8eb3f1e19095e18"
    v2_data_hash = "0xe9fc4b4cab511fee98e9315816a5d87de783759c1ffd4785f3446bc55f5ace84"
    v2_tx_hash = "0xcb027bd76960ccfaa82aac26bef845397eb3ef90fdefa8d340f8378a981827ad"
    healthcare_provider_wallet = "0xD607C8B31cD9DFEBa82DaC425e69B126B24eD2F3"

    cypher_query = f"""
MATCH (h:HealthcareProvider {{name: 'Bệnh viện Hoàn Mỹ Đà Nẵng', type: 'BV'}}) SET h.wallet = '{healthcare_provider_wallet}'
CREATE (n:Patient {{pid: '{pid}', wallet: '{patient_wallet}', sex: 'nu', dob: '2020-03-14', ethnic: 'Kinh', reg_province: 'Đà Nẵng', reg_district: 'Hải Châu', reg_commune: 'Hòa Cường Bắc'}})
CREATE (v1:Vaccination {{pid: '{pid}', name: 'Quinvaxem', date: '2021-09-01', type: 'TCCD', data_hash: '{v1_data_hash}', tx_hash: '{v1_tx_hash}'}})
CREATE (v2:Vaccination {{pid: '{pid}', name: 'Hexaxim', date: '2022-01-01', type: 'TCMR', data_hash: '{v2_data_hash}', tx_hash: '{v2_tx_hash}'}})
CREATE (n)-[:RECEIVED]->(v1)
CREATE (n)-[:RECEIVED]->(v2)
CREATE (v1)-[:ADMINISTERED_BY]->(h)
CREATE (v2)-[:ADMINISTERED_BY]->(h);
"""
    try:
        execute_cypher_query(driver, cypher_query)
        print("✅ Successfully imported custom data!")
    except Exception as e:
        print(f"❌ Failed to import custom data: {e}")


# Run script
if __name__ == "__main__":
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    # clear_neo4j(driver=driver)
    # load_csv_to_neo4j(driver=driver, csv_url=csv_path_format.format(i=5))
    # load_chunked_files_to_neo4j(driver=driver, start=4, end=4)
    load_custom_data_to_neo4j(driver=driver)
    print("✅ Done!")
