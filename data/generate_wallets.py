import csv
from eth_account import Account
from neo4j import GraphDatabase

# Neo4j connection settings
NEO4J_URI = "neo4j+s://d8af6d58.databases.neo4j.io"  # Change to your Neo4j instance
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "cO0PNP_Kq14TGtkE3c6BrcwlF25aAkHsydFFjF1_s3c"

# CSV output file
CSV_FILE = "data/generated_wallets.csv"

# Connect to Neo4j
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))


def generate_wallets(limit=100):
    """Generate Ethereum wallets for patients and save to CSV & Neo4j"""
    with driver.session() as session:
        # Get patient PIDs
        result = session.run(
            "MATCH (p:Patient) WHERE p.wallet IS NULL RETURN p.pid LIMIT $limit",
            limit=limit,
        )
        patients = [{"pid": record["p.pid"]} for record in result]

        if not patients:
            print("No patients found without wallets.")
            return

        # Open CSV file
        with open(CSV_FILE, "w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["pid", "wallet_address", "private_key"])

            for patient in patients:
                # Generate a new wallet
                account = Account.create()
                wallet_address = account.address
                private_key = "0x" + account.key.hex()

                # Save to CSV
                writer.writerow([patient["pid"], wallet_address, private_key])

                # Store only wallet address in Neo4j
                session.run(
                    "MATCH (p:Patient {pid: $pid}) SET p.wallet = $wallet",
                    pid=patient["pid"],
                    wallet=wallet_address,
                )

                print(f"Generated: {patient['pid']} → {wallet_address}")

    print(f"✅ Wallets saved to {CSV_FILE}")


# Generate wallets for the first 100 patients
generate_wallets(limit=100)
