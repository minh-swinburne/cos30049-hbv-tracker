from web3 import Web3

def generate_hash(wallet, vaccine, date):
    """Create a SHA-256 hash of vaccination details."""
    data_string = f"{wallet}{vaccine}{date}"
    return Web3.keccak(text=data_string).hex()
