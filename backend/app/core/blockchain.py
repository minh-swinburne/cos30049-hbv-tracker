from web3 import Web3
from app.core.settings import settings

# Connect to Ethereum blockchain
web3 = Web3(Web3.HTTPProvider(settings.blockchain_rpc))

# Smart contract ABI & Address
contract_address = settings.contract_address
contract_abi = settings.contract_abi
contract = web3.eth.contract(address=contract_address, abi=contract_abi)


async def verify_vaccination(wallet_address: str):
    """Check if vaccination data hash exists on blockchain."""
    try:
        record_hash = contract.functions.getHash(wallet_address).call()
        return record_hash != "0x0"
    except Exception as e:
        return {"error": str(e)}
