from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import json


# Load .env at startup
load_dotenv("config/.env.dev", override=True)

# Read the ABI file and load it as JSON
def load_contract_abi(path) -> list:
    try:
        with open(path, "r") as abi_file:
            return json.load(abi_file)
    except FileNotFoundError:
        raise FileNotFoundError(f"Contract ABI file not found: {path}")

# Define the settings class
class Settings(BaseSettings):
    frontend_origins: str = "http://localhost:3000,http://localhost:8000"
    blockchain_rpc: str = "http://localhost:8545"
    
    contract_address: str = "0x1234567890abcdef1234567890abcdef12345678"
    contract_abi_path: str = "config/contract_abi.json"
    contract_abi: list = []

    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"

    # db_dialect: str
    # db_driver: str
    # db_driver_async: str
    # db_username: str
    # db_password: str
    # db_host: str
    # db_port: str
    # db_database: str
    # db_logging: bool

    redis_host: str
    redis_port: str
    redis_db: str


settings = Settings()
settings.contract_abi = load_contract_abi(settings.contract_abi_path)
