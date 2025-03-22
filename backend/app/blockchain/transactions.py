from app.core.blockchain import web3, contract


def store_vaccination(address: str, data_hash: str, signature: str) -> str:
    """
    Store vaccination hash on the blockchain.

    The transaction is sent from `address`, but the backend submits it.
    """
    txn = contract.functions.storeHash(data_hash, signature).build_transaction({
        "from": address,
        "to": contract.address,
        "nonce": web3.eth.get_transaction_count(address),
        "gas": 200000,
        "gasPrice": web3.to_wei("5", "gwei")
    })

    # Send transaction (signed externally by Metamask)
    tx_hash = web3.eth.send_transaction(txn)

    return tx_hash.hex()


def get_vaccination(address: str) -> str:
    """
    Retrieve vaccination record hashes of one patient from the blockchain.
    """
    return contract.functions.getHashes(address).call()


def grant_access(address: str) -> str:
    """
    Grant access to the vaccination record (for a researcher).
    """
    tx_hash = contract.functions.grantAccess(address).transact()
    return tx_hash.hex()


def verify_vaccination(tx_hash: str, address: str) -> bool:
    """
    Verify a vaccination record hash on the blockchain.
    """
    receipt = web3.eth.get_transaction_receipt(tx_hash)
    if receipt is None:
        return False
    return contract.events.HashStored().processReceipt(receipt)[0]["args"]["signer"] == address