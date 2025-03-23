from app.core.blockchain import web3, contract
from app.blockchain.signature import verify_signature
from app.schemas import EthMessage, EthRecord, VaccinationAddress


def get_contract_address() -> str:
    """
    Retrieve the address of the deployed smart contract.
    """
    return contract.address


def get_deployer_address() -> str:
    """
    Retrieve the address of the contract deployer.
    """
    return contract.functions.deployer().call()


def is_authorized_healthcare_provider(address: str) -> bool:
    return contract.functions.authorizedHealthcareProviders(address).call()


def is_authorized_researcher(address: str) -> bool:
    return contract.functions.authorizedResearchers(address).call()


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


def get_hashes(address: str) -> list[EthRecord]:
    """
    Retrieve vaccination record hashes of one patient from the blockchain.
    """
    # Call contract and return result
    hashes, timestamps = contract.functions.getHashes(address).call()

    return [
        EthRecord(data_hash=web3.to_hex(h), timestamp=ts)
        for h, ts in zip(hashes, timestamps)
    ]


def grant_access(address: str, message: EthMessage, signature: str) -> str:
    """
    Grant access to the vaccination record (for a researcher).
    """
    # Verify signature
    if not verify_signature(message, signature, address):
        raise ValueError("Invalid signature")

    # Send transaction (signed externally by Metamask)
    tx_hash = contract.functions.grantAccess(address).transact(
        {
            "from": address,
            "to": contract.address,
            "nonce": web3.eth.get_transaction_count(address),
            "gas": 200000,
            "gasPrice": web3.to_wei("5", "gwei"),
        }
    )
    return tx_hash.hex()


def verify_transaction(tx_hash: str, address: str) -> str:
    """
    Verify a vaccination record on the blockchain given the transaction hash and the patient's address. Return the data hash.
    """
    tx_receipt = web3.eth.get_transaction_receipt(tx_hash)

    if tx_receipt is None:
        raise ValueError("Transaction not found")

    processed_logs = contract.events.VaccinationStored().process_receipt(tx_receipt)

    event_data = processed_logs[0]["args"]
    event_patient = event_data["patient"]
    event_hash = event_data["dataHash"]

    if event_patient == address:
        return "0x" + event_hash.hex()
    else:
        raise ValueError("Patient address mismatch")
