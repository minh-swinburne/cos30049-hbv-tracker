/*
Authors: 
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { runQuery } from "../data/neo4jConfig";

interface LoginState {
  isConnecting: boolean;
  error: string | null;
  account: string | null;
  userType: "patient" | "provider" | null;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<LoginState>({
    isConnecting: false,
    error: null,
    account: null,
    userType: null,
  });

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setState((prev) => ({ ...prev, account: accounts[0] }));
            await checkUserType(accounts[0]);
          }
        } catch (err) {
          console.error("Error checking connection:", err);
        }
      }
    };

    checkConnection();
  }, []);

  const checkUserType = async (account: string) => {
    try {
      // Check if the account exists in either Patient or HealthcareProvider nodes
      const query = `
        MATCH (n)
        WHERE (n:Patient OR n:HealthcareProvider) AND n.id = $account
        RETURN labels(n)[0] as type
      `;

      const result = await runQuery(query, { account });

      if (result.length > 0) {
        const userType = result[0].get("type").toLowerCase();
        setState((prev) => ({
          ...prev,
          userType: userType === "patient" ? "patient" : "provider",
        }));

        // Redirect based on user type
        if (userType === "patient") {
          navigate(`/patient/${account}`);
        } else {
          navigate(`/provider/${account}`);
        }
      }
    } catch (err) {
      console.error("Error checking user type:", err);
      setState((prev) => ({ ...prev, error: "Error checking user type" }));
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: "Please install MetaMask to use this feature",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setState((prev) => ({ ...prev, account: accounts[0] }));
      await checkUserType(accounts[0]);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setState((prev) => ({
        ...prev,
        error: "Error connecting to MetaMask",
      }));
    } finally {
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="Login"
        description="Connect your wallet to access the HBV Vaccine Tracker"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Connect Your Wallet
            </h2>

            {state.error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {state.error}
              </div>
            )}

            {!state.account ? (
              <button
                onClick={connectWallet}
                disabled={state.isConnecting}
                className={`w-full py-3 px-4 rounded-md text-white ${
                  state.isConnecting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {state.isConnecting ? "Connecting..." : "Connect with MetaMask"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-100 text-green-700 rounded-md">
                  Connected: {state.account.slice(0, 6)}...
                  {state.account.slice(-4)}
                </div>
                {!state.userType && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate("/register/patient")}
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Register as Patient
                    </button>
                    <button
                      onClick={() => navigate("/register/provider")}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Register as Provider
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm text-gray-600 text-center">
                New to HBV Vaccine Tracker?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>

          {/* MetaMask Instructions */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Don't have MetaMask?
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Install MetaMask from the official website</li>
              <li>Create or import a wallet</li>
              <li>Connect to the Ethereum network</li>
              <li>Return here to connect your wallet</li>
            </ol>
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Get MetaMask →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
