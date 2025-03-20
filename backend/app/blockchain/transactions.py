from app.core.blockchain import web3, contract


def store_vaccination(address: str, data_hash: str, signature: str) -> str:
    """
    Store vaccination hash on the blockchain.

    This function does NOT sign the transaction. 
    The frontend (MetaMask) must sign it before sending.
    """
    # Signature verification is handled by the smart contract
    # Store data on the blockchain
    tx_hash = contract.functions.storeHash(data_hash, signature).transact({
        "from": address
    })
    
    return tx_hash.hex()


def get_vaccination(address: str) -> str:
    """
    Retrieve a vaccination record hash from the blockchain.
    """
    return contract.functions.getHash(address).call()


def grant_access(address: str) -> str:
    """
    Grant access to the vaccination record (for a researcher).
    """
    tx_hash = contract.functions.grantAccess(address).transact()
    return tx_hash.hex()