/**
 * @file ProviderDashboard.tsx
 * @description Dashboard for healthcare providers to manage vaccinations
 * @author Group 3
 * @date 2024-03-20
 */

import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import apiClient from "../api";
import type { HealthcareProvider, VaccinationRecord } from "../api/graph";
import AppHeader from "../components/AppHeader";
import { useMetaMask } from "../hooks/useMetaMask";

interface DailyStats {
  date: string;
  count: number;
}

interface ProviderDashboardState {
  provider: HealthcareProvider | null;
  vaccinations: VaccinationRecord[];
  isLoading: boolean;
  error: string | null;
  stats: {
    total_vaccinations: number;
    total_patients: number;
    total_providers: number;
  } | null;
}

const ProviderDashboard: FC = () => {
  const navigate = useNavigate();
  const { account, isConnected } = useMetaMask();
  const [state, setState] = useState<ProviderDashboardState>({
    provider: null,
    vaccinations: [],
    isLoading: true,
    error: null,
    stats: null,
  });

  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    if (!isConnected || !account) {
      navigate("/login");
      return;
    }

    const fetchProviderData = async () => {
      try {
        setState((prev: ProviderDashboardState) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));

        const provider = await apiClient.graph.getProvider(account);
        const vaccinations = await apiClient.graph.getProviderVaccinations(
          account
        );

        setState({
          provider,
          vaccinations: vaccinations.nodes,
          isLoading: false,
          error: null,
          stats: {
            total_vaccinations: vaccinations.nodes.length,
            total_patients: new Set(vaccinations.nodes.map((v) => v.pid)).size,
            total_providers: 1, // Adjust based on actual data
          },
        });
      } catch (error) {
        setState((prev: ProviderDashboardState) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load provider data. Please try again.",
        }));
      }
    };

    fetchProviderData();
  }, [account, isConnected, navigate]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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

  if (!state.provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Provider profile not found.</p>
          <button
            onClick={() => navigate("/register?type=provider")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Register as Provider
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="Healthcare Provider Dashboard"
        description="Manage vaccinations and view statistics"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Provider Information
          </h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {state.provider.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Region</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {state.provider.region}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Wallet Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {state.provider.wallet_address}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Total Vaccinations
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {state.stats?.total_vaccinations}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Total Patients
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {state.stats?.total_patients}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Total Providers
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {state.stats?.total_providers}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Vaccination Records
            </h2>
            <button
              onClick={() => navigate("/vaccination/new")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add New Vaccination
            </button>
          </div>
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
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vaccine Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
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
                        {record.patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.vaccination.vaccine_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.vaccination.batch_number}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() =>
                            navigate(`/vaccination/${record.vaccination.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Daily Statistics
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Vaccinations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
