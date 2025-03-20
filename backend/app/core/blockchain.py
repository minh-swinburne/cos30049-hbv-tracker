from web3 import Web3
from web3.contract import Contract
from app.core.settings import settings

# Connect to Ethereum blockchain
web3 = Web3(Web3.HTTPProvider(settings.blockchain_rpc))

# Smart contract ABI & Address
contract_address = settings.contract_address
contract_abi = settings.contract_abi

contract: Contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def setup_blockchain():
    # Check connection status
    if web3.is_connected():
        network_id = web3.net.version
        print("✅ Connected to Ethereum network with ID:", network_id)
    else:
        raise Exception("❌ Unable to connect to Ethereum blockchain")
