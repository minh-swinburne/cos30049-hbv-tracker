export interface EthMessage {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  message: {
    contents: string;
    patient: string;
    vaccine: string;
    date: string;
    type: string;
  };
  primaryType: string;
  types: {
    EIP712Domain: { name: string; type: string }[];
    VaccinationRecord: { name: string; type: string }[];
  };
}

export interface EthAddress {
  address: string;
}

export interface EthHash {
  dataHash: string;
  txHash: string;
}

export interface EthRecord {
  dataHash: string;
  timestamp: number;
}
