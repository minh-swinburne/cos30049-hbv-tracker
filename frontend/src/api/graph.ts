/**
 * @file graph.ts
 * @description API client for graph-related operations
 * @author Group 3
 * @date 2025-03-20
 */

import { BaseClient } from "./baseClient";
import type {
  GraphPatient,
  GraphHealthcareProvider,
  GraphVaccination,
  GraphData,
} from "../types/graph";

const prefix = "/graph";

export const graphClient = (client: BaseClient) => ({
  getGraphAddress: () => client.get<{ address: string }>(`${prefix}/address`),

  getAllGraphData: () => client.get<GraphData>(`${prefix}/all`),

  getNodeHop: (id?: string, type?: string, address?: string) =>
    client.get<GraphData>(`${prefix}/hop?id=${id}&type=${type}&address=${address}`),

  getPatient: (address: string) =>
    client.get<GraphPatient>(`${prefix}/patient/${address}`),

  getPatientVaccinations: (address: string) =>
    client.get<GraphData>(`${prefix}/patient/${address}/records`),

  registerPatient: (data: GraphPatient) =>
    client.post<GraphPatient>(`${prefix}/patient/create`, data),

  getProvider: (address: string) =>
    client.get<GraphHealthcareProvider>(`${prefix}/provider/${address}`),

  getProviderVaccinations: (address: string) =>
    client.get<GraphData>(`${prefix}/provider/${address}/records`),

  registerProvider: (data: GraphHealthcareProvider) =>
    client.post<GraphHealthcareProvider>(`${prefix}/provider/create`, data),

  getVaccination: (txHash: string) =>
    client.get<GraphVaccination>(`${prefix}/vaccination/${txHash}`),

  createVaccination: (data: {
    vaccination: GraphVaccination;
    healthcareProvider: GraphHealthcareProvider;
  }) => client.post<GraphVaccination>(`${prefix}/vaccination/create`, data),
});
