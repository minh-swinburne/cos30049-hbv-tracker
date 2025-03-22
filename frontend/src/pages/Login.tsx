/**
 * @file Login.tsx
 * @description Login page with MetaMask integration
 * @author Group 3
 * @date 2024-03-20
 */

import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "../hooks/useMetaMask";
import { graphClient } from "../api/graphClient";

interface LoginState {
  isConnecting: boolean;
  error: string | null;
  account: string | null;
  userType: "patient" | "provider" | null;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const {
    isConnected,
    account,
    connectWallet,
    error: metaMaskError,
  } = useMetaMask();
  const [state, setState] = useState<LoginState>({
    isConnecting: false,
    error: null,
    account: null,
    userType: null,
  });

  useEffect(() => {
    if (isConnected && account) {
      checkUserType(account);
    }
  }, [isConnected, account]);

  const checkUserType = async (walletAddress: string) => {
    try {
      // Try to get patient data
      try {
        await graphClient.getPatient(walletAddress);
        setState((prev) => ({ ...prev, userType: "patient" }));
        navigate("/patient-profile");
        return;
      } catch (error) {
        // Patient not found, try provider
      }

      // Try to get provider data
      try {
        await graphClient.getProvider(walletAddress);
        setState((prev) => ({ ...prev, userType: "provider" }));
        navigate("/provider-dashboard");
        return;
      } catch (error) {
        // Provider not found
      }

      // If neither patient nor provider found
      setState((prev) => ({
        ...prev,
        error: "Account not registered. Please register first.",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Error checking user type. Please try again.",
      }));
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
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {state.error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {state.error}
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
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                Connected: {account}
              </div>
              <div className="text-sm text-gray-600">
                If you haven't registered yet, please register as a patient or
                healthcare provider.
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate("/register?type=patient")}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Register as Patient
                </button>
                <button
                  onClick={() => navigate("/register?type=provider")}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register as Provider
                </button>
              </div>
            </div>
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

export default Login;
