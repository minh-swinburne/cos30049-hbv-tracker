from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import json

# Load environment variables from the .env file
load_dotenv("config/.env.dev", override=True)


# Read the ABI file and load it as JSON
def load_contract_abi(path) -> list:
    """
    Load the contract ABI from the specified JSON file.
    """
    try:
        with open(path, "r") as abi_file:
            return json.load(abi_file)
    except FileNotFoundError:
        raise FileNotFoundError(f"Contract ABI file not found: {path}")


# Define the settings class
class Settings(BaseSettings):
    """
    Application settings loaded from environment variables and defaults.
    """

    frontend_origins: str = "http://localhost:3000,http://localhost:8000"
    blockchain_rpc: str = "http://localhost:8545"

    contract_address: str = "0x1234567890abcdef1234567890abcdef12345678"
    contract_abi_path: str = "config/contract_abi.json"
    contract_abi: list = []

    jwt_secret_key: str
    jwt_algorithm: str
    jwt_access_expires_in: str

    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"

    redis_host: str
    redis_port: str
    redis_db: str


# Initialize settings and load the contract ABI
settings = Settings()
settings.contract_abi = load_contract_abi(settings.contract_abi_path)
