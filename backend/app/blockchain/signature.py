from app.core.blockchain import web3
from app.schemas.auth import EthMessage
from eth_account.messages import encode_defunct, encode_typed_data


def sign_message(message: dict, private_key: str) -> str:
    """Sign message with private key"""
    signed_message = web3.eth.account.sign_message(
        encode_typed_data(full_message=message), private_key=private_key
    )
    return signed_message.signature.hex()


def verify_signature(message: EthMessage | str, signature: str, address: str) -> bool:
    """Verify MetaMask signature"""
    if isinstance(message, str):
        encoded_message = encode_defunct(text=message)
    else:
        encoded_message = encode_typed_data(full_message=message.model_dump())
    recovered = web3.eth.account.recover_message(encoded_message, signature=signature)
    return address.lower() == recovered.lower()
