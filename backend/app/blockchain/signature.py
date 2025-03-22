from app.core.blockchain import web3
from eth_account.messages import encode_defunct


def sign_message(message: str, private_key: str) -> str:
    """Sign message with MetaMask"""
    signed_message = web3.eth.account.sign_message(encode_defunct(text=message), private_key=private_key)
    return signed_message.signature.hex()


def verify_signature(message: str, signature: str, address: str) -> bool:
    """Verify MetaMask signature"""
    signed_message = encode_defunct(text=message)
    recovered_address = web3.eth.account.recover_message(signed_message, signature=signature)
    return address.lower() == recovered_address.lower()