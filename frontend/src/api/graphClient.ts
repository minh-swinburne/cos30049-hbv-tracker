/**
 * @file graphClient.ts
 * @description API client for graph-related operations
 * @author Group 3
 * @date 2024-03-20
 */

import { get, post } from './baseClient';

export interface Patient {
  id: string;
  name: string;
  region: string;
  wallet_address: string;
}

export interface HealthcareProvider {
  id: string;
  name: string;
  region: string;
  wallet_address: string;
}

export interface Vaccination {
  id: string;
  patient_id: string;
  provider_id: string;
  date: string;
  vaccine_type: string;
  batch_number: string;
  status: string;
}

export interface VaccinationRecord {
  vaccination: Vaccination;
  patient: Patient;
  provider: HealthcareProvider;
}

export interface RegistrationData {
  wallet_address: string;
  name: string;
  region: string;
}

export interface CreateVaccinationData {
  patient_id: string;
  provider_id: string;
  date: string;
  vaccine_type: string;
  batch_number: string;
  status: string;
}

export const graphClient = {
  // Patient operations
  getPatient: async (walletAddress: string): Promise<Patient> => {
    return get(`/graph/patient/${walletAddress}`);
  },

  registerPatient: async (data: RegistrationData): Promise<Patient> => {
    return post('/graph/patient/register', data);
  },

  getPatientVaccinations: async (walletAddress: string): Promise<VaccinationRecord[]> => {
    return get(`/graph/patient/${walletAddress}/vaccinations`);
  },

  // Provider operations
  getProvider: async (walletAddress: string): Promise<HealthcareProvider> => {
    return get(`/graph/provider/${walletAddress}`);
  },

  registerProvider: async (data: RegistrationData): Promise<HealthcareProvider> => {
    return post('/graph/provider/register', data);
  },

  getProviderVaccinations: async (walletAddress: string): Promise<VaccinationRecord[]> => {
    return get(`/graph/provider/${walletAddress}/vaccinations`);
  },

  // Vaccination operations
  getVaccination: async (vaccinationId: string): Promise<VaccinationRecord> => {
    return get(`/graph/vaccination/${vaccinationId}`);
  },

  createVaccination: async (data: CreateVaccinationData): Promise<Vaccination> => {
    return post('/graph/vaccination/create', data);
  },

  verifyVaccination: async (vaccinationId: string): Promise<{ valid: boolean; message: string }> => {
    return get(`/graph/vaccination/${vaccinationId}/verify`);
  },

  // Search operations
  searchPatients: async (query: string): Promise<Patient[]> => {
    return get(`/graph/patient/search?q=${encodeURIComponent(query)}`);
  },

  searchProviders: async (query: string): Promise<HealthcareProvider[]> => {
    return get(`/graph/provider/search?q=${encodeURIComponent(query)}`);
  },

  // Statistics
  getVaccinationStats: async (): Promise<{
    total_vaccinations: number;
    total_patients: number;
    total_providers: number;
  }> => {
    return get('/graph/stats');
  },
}; 