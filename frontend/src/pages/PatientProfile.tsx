/**
 * @file PatientProfile.tsx
 * @description Patient profile page showing vaccination history and details
 * @author Group 3
 * @date 2024-03-20
 */

import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api";
import type { VaccinationRecord } from "../types/vaccination";
import { useMetaMask } from "../hooks/useMetaMask";

interface PatientProfileState {
  patient: Patient | null;
  vaccinations: VaccinationRecord[];
  isLoading: boolean;
  error: string | null;
}

const PatientProfile: FC = () => {
  const navigate = useNavigate();
  const { account, isConnected } = useMetaMask();
  const [state, setState] = useState<PatientProfileState>({
    patient: null,
    vaccinations: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isConnected || !account) {
      navigate("/login");
      return;
    }

    const fetchPatientData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const patient = await apiClient.graph.getPatient(account);
        const vaccinations = await apiClient.graph.getPatientVaccinations(
          account
        );

        setState({
          patient,
          vaccinations: vaccinations.nodes,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load patient data. Please try again.",
        }));
      }
    };

    fetchPatientData();
  }, [account, isConnected, navigate]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{state.error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!state.patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Patient profile not found.</p>
          <button
            onClick={() => navigate("/register?type=patient")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Register as Patient
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Patient Profile
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Personal Information
              </h2>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {state.patient.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Region</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {state.patient.region}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Wallet Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {state.patient.wallet_address}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Vaccination History
          </h2>
          {state.vaccinations.length === 0 ? (
            <p className="text-gray-500">No vaccination records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vaccine Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.vaccinations.map((record) => (
                    <tr key={record.vaccination.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.vaccination.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.vaccination.vaccine_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.vaccination.batch_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.provider.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.vaccination.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.vaccination.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
