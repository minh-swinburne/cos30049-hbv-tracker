from app.core.blockchain import web3, contract
from app.blockchain.signature import verify_signature
from app.schemas.auth import EthMessage
from app.schemas import VaccinationAddress


def get_contract_address() -> str:
    """
    Retrieve the address of the deployed smart contract.
    """
    return contract.address


def store_hash(
    address: VaccinationAddress, data_hash: str, message: EthMessage, signature: str
) -> str:
    """
    Store vaccination hash on the blockchain.

    The transaction is sent from `address`, but the backend submits it.
    """
    # Verify signature
    if not verify_signature(message, signature, address.healthcare_provider):
        raise ValueError("Invalid signature")

    txn = contract.functions.storeHash(address.patient, data_hash).transact(
        {
            "from": address.healthcare_provider,
            "to": contract.address,
            "nonce": web3.eth.get_transaction_count(address.healthcare_provider),
            "gas": 200000,
            "gasPrice": web3.to_wei("5", "gwei"),
        }
    )

    # Send transaction (signed externally by Metamask)
    tx_hash = web3.eth.send_raw_transaction(txn)
    return "0x" + tx_hash.hex()


def get_hashes(address: str) -> list[str]:
    """
    Retrieve vaccination record hashes of one patient from the blockchain.
    """
    # Call contract and return result
    hashes = contract.functions.getHashes(address).call()
    return [web3.to_hex(h) for h in hashes]


def grant_access(address: str, message: EthMessage, signature: str) -> str:
    """
    Grant access to the vaccination record (for a researcher).
    """
    # Verify signature
    if not verify_signature(message, signature, address):
        raise ValueError("Invalid signature")

    # Send transaction (signed externally by Metamask)
    tx_hash = contract.functions.grantAccess(address).transact({
        "from": address,
        "to": contract.address,
        "nonce": web3.eth.get_transaction_count(address),
        "gas": 200000,
        "gasPrice": web3.to_wei("5", "gwei"),
    })
    return tx_hash.hex()


def verify_vaccination(tx_hash: str, address: str) -> bool:
    """
    Verify a vaccination record hash on the blockchain.
    """
    receipt = web3.eth.get_transaction_receipt(tx_hash)
    if receipt is None:
        return False
    return (
        contract.events.HashStored().processReceipt(receipt)[0]["args"]["signer"]
        == address
    )
