/**
 * @file blockchain.ts
 * @description API client for blockchain-related operations
 * @author Group 3
 * @date 2025-03-20
 */

import type { EthHash, EthRecord } from "../types/blockchain";
import { BaseClient } from "./baseClient";

const prefix = "/blockchain";

interface VaccinationRecord {
  patient: string;
  vaccine: string;
  date: string;
  type: string;
}

interface BlockchainResponse {
  message: any;
  signature: string;
}

export const blockchainClient = (client: BaseClient) => ({
  getHashes: (address: string): Promise<EthRecord[]> =>
    client.get(`${prefix}/get/${address}`),

  verifyTx: (address: string, txHash: string): Promise<EthHash> =>
    client.get(`${prefix}/verify/${address}?txHash=${txHash}`),

  checkProviderRegistration: (
    address: string
  ): Promise<{ authorized: boolean }> =>
    client.get(`${prefix}/provider/${address}`),

  checkResearcherRegistration: (
    address: string
  ): Promise<{ authorized: boolean }> =>
    client.get(`${prefix}/researcher/${address}`),

  createVaccinationRecord: (data: VaccinationRecord): Promise<BlockchainResponse> =>
    client.post(`${prefix}/vaccination/create`, data),
});
