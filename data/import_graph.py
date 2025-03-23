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
    healthcare_provider_wallet = "0xEAfB5ac55900871bebA44C5A4241CFc094575a56"

    v1_data_hash = "0x28967b28e7143cacbecf950efca28d3b22062e906578fadcb340b6a991dc2665"
    v1_tx_hash = "0x15365fca84a527b04c1151a7863879ae4b74d184b92f893ded53a9f196355bc3"

    v2_data_hash = "0xf392b9511fcf3f8c20b7c9fb136b127df7c84f370ee3fb5a7165e002c0f7f614"
    v2_tx_hash = "0xfffbebab5cb8b5e86958148aa62a889d68e959ef4ad09894e6d47cd5a5cef17a"

    cypher_query = f"""
MATCH (h:HealthcareProvider {{name: 'Bệnh viện Hoàn Mỹ Đà Nẵng', type: 'BV'}})
SET h.wallet = '{healthcare_provider_wallet}'
MERGE (p:Patient {{pid: '{pid}', sex: 'nu', dob: '2020-03-14', ethnic: 'Kinh', reg_province: 'Đà Nẵng', reg_district: 'Hải Châu', reg_commune: 'Hòa Cường Bắc'}})
SET p.wallet = '{patient_wallet}'
MERGE (v1:Vaccination {{pid: '{pid}', name: 'Quinvaxem', date: '2021-09-01', type: 'TCCD'}})
SET v1.data_hash = '{v1_data_hash}', v1.tx_hash = '{v1_tx_hash}'
MERGE (v2:Vaccination {{pid: '{pid}', name: 'Hexaxim', date: '2022-01-01', type: 'TCMR'}})
SET v2.data_hash = '{v2_data_hash}', v2.tx_hash = '{v2_tx_hash}'
MERGE (p)-[:RECEIVED]->(v1)
MERGE (p)-[:RECEIVED]->(v2)
MERGE (v1)-[:ADMINISTERED_BY]->(h)
MERGE (v2)-[:ADMINISTERED_BY]->(h);
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
