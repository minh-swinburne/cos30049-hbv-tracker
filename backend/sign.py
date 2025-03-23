from web3 import Web3
from eth_account.messages import encode_typed_data

data = {
    "domain": {
        "name": "HBVTracker",
        "version": "1",
        "chainId": 39438144,
        "verifyingContract": "0x671aeA46fe1a2F5e76C786953E5324Fa5A91D185",
    },
    "message": {
        "contents": "I authorize storing this vaccination record.",
        "patient": "0x4ca32d107c8BF5481aA8EE9C0d287F7F5aDe62EE",
        "vaccine": "Quinvaxem",
        "date": "2021-09-01",
        "type": "TCCD",
    },
    "primaryType": "VaccinationRecord",
    "types": {
        "EIP712Domain": [
            {"name": "name", "type": "string"},
            {"name": "version", "type": "string"},
            {"name": "chainId", "type": "uint256"},
            {"name": "verifyingContract", "type": "address"},
        ],
        "VaccinationRecord": [
            {"name": "patient", "type": "address"},
            {"name": "vaccine", "type": "string"},
            {"name": "date", "type": "string"},
            {"name": "type", "type": "string"},
        ],
    },
}

web3 = Web3(Web3.HTTPProvider("https://rpc.bordel.wtf/test"))
signature = "0xa30ab9e7ff92a2b98517ab44c97f7b6df828785ed98f3444ecf88fe7fcceac61068567dfc2c8b6fc85c4b225c1edc835eb7bd2e46214fde3cf086581af9e69fa1b"

message = encode_typed_data(full_message=data)
recovered = web3.eth.account.recover_message(message, signature=signature)

print(recovered)
