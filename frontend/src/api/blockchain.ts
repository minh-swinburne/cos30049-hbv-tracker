/**
 * @file blockchain.ts
 * @description API client for blockchain-related operations
 * @author Group 3
 * @date 2025-03-20
 */

import type { EthHash, EthRecord } from "../types/blockchain";
import { BaseClient } from "./baseClient";

const prefix = "/blockchain";

export const blockchainClient = (client: BaseClient) => ({
  getHashes: (address: string): Promise<EthRecord[]> =>
    client.get(`${prefix}/get/${address}`),

  verifyTx: (address: string, txHash: string): Promise<EthHash> =>
    client.get(`${prefix}/verify/${address}?txHash=${txHash}`),
});
