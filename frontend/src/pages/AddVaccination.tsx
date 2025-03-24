/**
 * @file AddVaccination.tsx
 * @description Page for adding new vaccination records with MetaMask signature
 * @author Group 3
 * @date 2024-03-20
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "../hooks/useMetaMask";
import { graphClient } from "../api/graph";
import { blockchainClient } from "../api/blockchain";
import { BaseClient } from "../api/baseClient";
import type { GraphVaccination, GraphHealthcareProvider } from "../types/graph";

interface AddVaccinationState {
  patientAddress: string;
  vaccineName: string;
  vaccinationDate: string;
  vaccinationType: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  message: string | null;
  signature: string | null;
}

const AddVaccination: React.FC = () => {
  const navigate = useNavigate();
  const { account, isConnected } = useMetaMask();
  const [state, setState] = useState<AddVaccinationState>({
    patientAddress: "",
    vaccineName: "",
    vaccinationDate: "",
    vaccinationType: "",
    isLoading: false,
    error: null,
    success: null,
    message: null,
    signature: null,
  });

  useEffect(() => {
    if (!isConnected || !account) {
      navigate("/login");
    }
  }, [isConnected, account, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setState((prev) => ({
        ...prev,
        error: "Please connect your wallet first",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      success: null,
    }));

    try {
      // Create vaccination record in the graph database
      const vaccinationData = {
        vaccination: {
          pid: state.patientAddress,
          name: state.vaccineName,
          date: new Date(state.vaccinationDate),
          type: state.vaccinationType,
          data_hash: undefined,
          tx_hash: undefined,
        } as GraphVaccination,
        healthcareProvider: {
          wallet: account,
          name: "Provider", // This should be fetched from the provider data
          type: "Healthcare Provider",
        } as GraphHealthcareProvider,
      };

      const client = new BaseClient();
      const graphResponse = await graphClient(client).createVaccination(
        vaccinationData
      );

      // Create vaccination record on the blockchain
      const blockchainResponse = await blockchainClient(
        client
      ).createVaccinationRecord({
        patient: state.patientAddress,
        vaccine: state.vaccineName,
        date: state.vaccinationDate,
        type: state.vaccinationType,
      });

      setState((prev) => ({
        ...prev,
        success: "Vaccination record created successfully!",
        message: JSON.stringify(blockchainResponse.message),
        signature: blockchainResponse.signature,
      }));

      // Reset form
      setState((prev) => ({
        ...prev,
        patientAddress: "",
        vaccineName: "",
        vaccinationDate: "",
        vaccinationType: "",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create vaccination record",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Add New Vaccination Record
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Fill in the details below to create a new vaccination record.
              </p>
            </div>

            {state.error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{state.error}</p>
                  </div>
                </div>
              </div>
            )}

            {state.success && (
              <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{state.success}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              <div>
                <label
                  htmlFor="patientAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Patient Wallet Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="patientAddress"
                    id="patientAddress"
                    required
                    value={state.patientAddress}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="vaccineName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vaccine Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="vaccineName"
                    id="vaccineName"
                    required
                    value={state.vaccineName}
                    onChange={handleInputChange}
                    placeholder="e.g. Pfizer"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="vaccinationDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vaccination Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="vaccinationDate"
                    id="vaccinationDate"
                    required
                    value={state.vaccinationDate}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="vaccinationType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vaccination Type
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="vaccinationType"
                    id="vaccinationType"
                    required
                    value={state.vaccinationType}
                    onChange={handleInputChange}
                    placeholder="e.g. Booster"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={state.isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {state.isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Create Vaccination Record"
                  )}
                </button>
              </div>
            </form>

            {state.message && state.signature && (
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Message</h4>
                  <pre className="mt-1 text-sm text-gray-500 bg-gray-50 p-4 rounded-md overflow-x-auto">
                    {state.message}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Signature
                  </h4>
                  <pre className="mt-1 text-sm text-gray-500 bg-gray-50 p-4 rounded-md overflow-x-auto">
                    {state.signature}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVaccination;
