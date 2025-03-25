/**
 * @file NewVaccination.tsx
 * @description Page for healthcare providers to add new vaccination records
 * @author Group 3
 * @date 2024-03-20
 */

import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api";
import type { Patient } from "../api/graph";
import { useMetaMask } from "../hooks/useMetaMask";

interface NewVaccinationState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  patients: Patient[];
  selectedPatient: string;
  vaccineType: string;
  batchNumber: string;
  date: string;
}

const NewVaccination: FC = () => {
  const navigate = useNavigate();
  const { account, isConnected } = useMetaMask();
  const [state, setState] = useState<NewVaccinationState>({
    isLoading: false,
    error: null,
    success: null,
    patients: [],
    selectedPatient: "",
    vaccineType: "",
    batchNumber: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!isConnected || !account) {
      navigate("/wallet");
      return;
    }

    const fetchPatients = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const patients = await apiClient.graph.getAllGraphData();
        setState((prev) => ({
          ...prev,
          patients: patients.nodes,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load patients. Please try again.",
        }));
      }
    };

    fetchPatients();
  }, [account, isConnected, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (
      !state.selectedPatient ||
      !state.vaccineType ||
      !state.batchNumber ||
      !state.date
    ) {
      setState((prev) => ({ ...prev, error: "Please fill in all fields" }));
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        success: null,
      }));

      await apiClient.graph.createVaccination({
        vaccination: {
          pid: state.selectedPatient,
          name: state.vaccineType,
          date: state.date,
          type: state.batchNumber,
        },
        healthcareProvider: {
          wallet: account,
          name: "Provider Name", // Replace with actual provider name
          type: "Healthcare",
        },
      });

      setState((prev) => ({
        ...prev,
        success: "Vaccination record created successfully!",
        isLoading: false,
      }));

      setTimeout(() => {
        navigate("/provider-dashboard");
      }, 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to create vaccination record. Please try again.",
      }));
    }
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Vaccination
          </h1>

          {state.error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {state.error}
            </div>
          )}

          {state.success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {state.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="selectedPatient"
                className="block text-sm font-medium text-gray-700"
              >
                Patient
              </label>
              <select
                id="selectedPatient"
                name="selectedPatient"
                value={state.selectedPatient}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a patient</option>
                {state.patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.region})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="vaccineType"
                className="block text-sm font-medium text-gray-700"
              >
                Vaccine Type
              </label>
              <input
                type="text"
                id="vaccineType"
                name="vaccineType"
                value={state.vaccineType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="batchNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Batch Number
              </label>
              <input
                type="text"
                id="batchNumber"
                name="batchNumber"
                value={state.batchNumber}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={state.date}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/provider-dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={state.isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {state.isLoading ? "Creating..." : "Create Vaccination Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewVaccination;
