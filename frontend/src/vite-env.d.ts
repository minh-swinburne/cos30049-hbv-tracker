/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BLOCKCHAIN_RPC_URL: string;
  readonly VITE_BLOCKCHAIN_CHAIN_ID: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_CONTRACT_ABI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}