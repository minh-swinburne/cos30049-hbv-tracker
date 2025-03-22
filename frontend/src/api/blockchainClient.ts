/**
 * @file blockchainClient.ts
 * @description API client for blockchain-related operations
 * @author Group 3
 * @date 2024-03-20
 */

import { get, post } from './baseClient';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface ContractEvent {
  event: string;
  data: any;
  blockNumber: number;
  transactionHash: string;
}

export interface VaccinationRecord {
  patientAddress: string;
  providerAddress: string;
  vaccineType: string;
  batchNumber: string;
  date: string;
  signature: string;
}

export const blockchainClient = {
  // Transaction operations
  getTransaction: async (hash: string): Promise<Transaction> => {
    return get(`/blockchain/transaction/${hash}`);
  },

  getTransactionHistory: async (address: string): Promise<Transaction[]> => {
    return get(`/blockchain/address/${address}/transactions`);
  },

  // Contract operations
  getContractEvents: async (eventName: string, fromBlock?: number): Promise<ContractEvent[]> => {
    const params = fromBlock ? `?fromBlock=${fromBlock}` : '';
    return get(`/blockchain/events/${eventName}${params}`);
  },

  // Vaccination record operations
  createVaccinationRecord: async (record: VaccinationRecord): Promise<{ hash: string }> => {
    return post('/blockchain/vaccination', record);
  },

  verifyVaccinationRecord: async (hash: string): Promise<{
    valid: boolean;
    record?: VaccinationRecord;
    message: string;
  }> => {
    return get(`/blockchain/vaccination/${hash}/verify`);
  },

  // Wallet operations
  getWalletBalance: async (address: string): Promise<string> => {
    return get(`/blockchain/address/${address}/balance`);
  },

  // Network operations
  getNetworkStatus: async (): Promise<{
    latestBlock: number;
    gasPrice: string;
    networkId: number;
  }> => {
    return get('/blockchain/network/status');
  },

  // Smart contract operations
  getContractAddress: async (): Promise<string> => {
    return get('/blockchain/contract/address');
  },

  getContractABI: async (): Promise<any> => {
    return get('/blockchain/contract/abi');
  },
}; 