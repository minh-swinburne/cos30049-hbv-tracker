/**
 * @file Register.tsx
 * @description Registration page for patients and healthcare providers
 * @author Group 3
 * @date 2024-03-20
 */

import React, { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api";
import { useMetaMask } from "../hooks/useMetaMask";
import MetaMaskIcon from "/metamask-icon.svg";

interface RegistrationState {
  isConnecting: boolean;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  account: string | null;
}

interface RegistrationFormData {
  name: string;
  region: string;
  sex: string;
  dob: string;
  ethnic: string;
  reg_province: string;
  reg_district: string;
  reg_commune: string;
  providerType: string;
}

const Register: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "patient";
  const {
    isConnected,
    account,
    connectWallet,
    error: metaMaskError,
  } = useMetaMask();
  const [state, setState] = useState<RegistrationState>({
    isConnecting: false,
    isSubmitting: false,
    error: null,
    success: null,
    account: null,
  });
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    region: "",
    sex: "",
    dob: "",
    ethnic: "",
    reg_province: "",
    reg_district: "",
    reg_commune: "",
    providerType: "Healthcare",
  });

  useEffect(() => {
    if (isConnected && account) {
      setState((prev) => ({ ...prev, account }));
    }
  }, [isConnected, account]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.account) {
      setState((prev) => ({
        ...prev,
        error: "Please connect your wallet first",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
      success: null,
    }));

    try {
      if (type === "patient") {
        // Register as patient
        await apiClient.graph.registerPatient({
          pid: state.account, // Using wallet address as patient ID
          wallet: state.account,
          sex: formData.sex,
          dob: new Date(formData.dob),
          ethnic: formData.ethnic,
          reg_province: formData.reg_province,
          reg_district: formData.reg_district,
          reg_commune: formData.reg_commune,
        });
      } else {
        // Register as healthcare provider
        await apiClient.graph.registerProvider({
          wallet: state.account,
          name: formData.name,
          type: formData.providerType,
        });
      }

      setState((prev) => ({
        ...prev,
        success: `Successfully registered as a ${type}! Redirecting...`,
      }));

      // Redirect after successful registration
      setTimeout(() => {
        navigate(
          type === "patient" ? "/patient-profile" : "/provider-dashboard"
        );
      }, 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Registration failed. Please try again.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleConnect = async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      await connectWallet();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to connect wallet. Please try again.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as {type === "patient" ? "Patient" : "Healthcare Provider"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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

          {metaMaskError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {metaMaskError}
            </div>
          )}

          {!isConnected ? (
            <div>
              <button
                onClick={handleConnect}
                disabled={state.isConnecting}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <img src={MetaMaskIcon} alt="MetaMask" className="w-5 h-5" />
                {state.isConnecting ? "Connecting..." : "Connect with MetaMask"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {type === "patient" ? (
                <>
                  <div>
                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                      Sex
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select sex</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="ethnic" className="block text-sm font-medium text-gray-700">
                      Ethnic Group
                    </label>
                    <input
                      type="text"
                      id="ethnic"
                      name="ethnic"
                      value={formData.ethnic}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="reg_province" className="block text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <input
                      type="text"
                      id="reg_province"
                      name="reg_province"
                      value={formData.reg_province}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="reg_district" className="block text-sm font-medium text-gray-700">
                      District
                    </label>
                    <input
                      type="text"
                      id="reg_district"
                      name="reg_district"
                      value={formData.reg_district}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="reg_commune" className="block text-sm font-medium text-gray-700">
                      Commune
                    </label>
                    <input
                      type="text"
                      id="reg_commune"
                      name="reg_commune"
                      value={formData.reg_commune}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Provider Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="providerType" className="block text-sm font-medium text-gray-700">
                      Provider Type
                    </label>
                    <select
                      id="providerType"
                      name="providerType"
                      value={formData.providerType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="Healthcare">Healthcare</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <button
                  type="submit"
                  disabled={state.isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {state.isSubmitting ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          )}

          {!window.ethereum && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Please install MetaMask to use this application.{" "}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Download MetaMask
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
