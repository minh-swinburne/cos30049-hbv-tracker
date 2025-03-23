/**
 * @file Register.tsx
 * @description Registration page for patients and healthcare providers
 * @author Group 3
 * @date 2024-03-20
 */

import React, { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { graphClient } from "../api/graph";
import { useMetaMask } from "../hooks/useMetaMask";

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
  });

  useEffect(() => {
    if (isConnected && account) {
      setState((prev) => ({ ...prev, account }));
    }
  }, [isConnected, account]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Create the registration data
      const registrationData = {
        wallet_address: state.account,
        name: formData.name,
        region: formData.region,
      };

      // Register the user based on type
      if (type === "patient") {
        await graphClient.registerPatient(registrationData);
      } else {
        await graphClient.registerProvider(registrationData);
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {state.isConnecting ? "Connecting..." : "Connect with MetaMask"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700"
                >
                  Region
                </label>
                <div className="mt-1">
                  <input
                    id="region"
                    name="region"
                    type="text"
                    required
                    value={formData.region}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

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
