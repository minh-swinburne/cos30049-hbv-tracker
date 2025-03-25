/**
 * @file Login.tsx
 * @description Login page with MetaMask integration
 * @author Group 3
 * @date 2024-03-20
 */

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMetaMask } from "../hooks/useMetaMask";
import { useStore } from "../store";
import MetaMaskIcon from "/metamask-icon.svg";

interface LoginState {
  isConnecting: boolean;
  error: string | null;
  account: string | null;
  userType: "healthcareProvider" | "researcher" | "patient" | null;
}

const Login: FC = () => {
  const blockchainExplorerUrl = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL;
  const navigate = useNavigate();
  const {
    isConnected,
    account,
    connectWallet,
    getBalance,
    error: metaMaskError,
    checkConnection, // Ensure this is exposed from the hook
  } = useMetaMask();
  const { user, userType } = useStore(); // Get userType from the store
  const [balance, setBalance] = useState<string | null>(null);
  const [state, setState] = useState<LoginState>({
    isConnecting: false,
    error: null,
    account: null,
    userType: null,
  });
  const [walletName, setWalletName] = useState<string | null>(
    localStorage.getItem("wallet-name") || null
  );
  const [editingName, setEditingName] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");

  useEffect(() => {
    checkConnection(); // Ensure connection status is checked on component mount
  }, [checkConnection]);

  useEffect(() => {
    if (isConnected) {
      const fetchBalance = async () => {
        const walletBalance = await getBalance();
        setBalance(walletBalance);
      };
      fetchBalance();
    }
  }, [isConnected, getBalance]); // React to changes in isConnected

  const handleConnect = async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      await connectWallet();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to connect wallet. Please try again.",
      }));
      console.error("Error connecting wallet:", error);
    } finally {
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  };

  const handleSaveWalletName = () => {
    localStorage.setItem("wallet-name", newWalletName);
    setWalletName(newWalletName);
    setEditingName(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const formatUserType = (type: string | null) => {
    switch (type) {
      case "healthcareProvider":
        return "Healthcare Provider";
      case "researcher":
        return "Researcher";
      case "patient":
        return "Patient";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div
        className={`sm:mx-auto sm:w-full sm:max-w-md ${
          isConnected ? "md:max-w-4xl" : "md:max-w-lg"
        }`}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isConnected ? "Wallet Profile" : "Connect to your Wallet"}
        </h2>
      </div>

      <div
        className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${
          isConnected ? "md:max-w-4xl" : "md:max-w-lg"
        }`}
      >
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
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <img src={MetaMaskIcon} alt="MetaMask" className="w-5 h-5" />
                {state.isConnecting ? "Connecting..." : "Connect with MetaMask"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 flex flex-col items-center">
                <div className="w-40 h-40">
                  <MetaMaskAvatar address={account || ""} size={160} />
                </div>
                <div className="mt-4 text-center">
                  {editingName ? (
                    <div className="flex flex-col items-center">
                      <input
                        type="text"
                        value={newWalletName}
                        onChange={(e) => setNewWalletName(e.target.value)}
                        className="border rounded px-2 py-1 text-center"
                        placeholder="Enter wallet name"
                      />
                      <button
                        onClick={handleSaveWalletName}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-lg">
                        {walletName || "Unnamed Wallet"}
                      </p>
                      <button
                        onClick={() => setEditingName(true)}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Edit Name
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2 space-y-4 px-4">
                <div>
                  <p className="font-bold text-gray-600 text-lg">
                    Wallet Address
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono break-all">{account}</p>
                    {account && (
                      <Tooltip title="Copy">
                        <IconButton
                          onClick={() => handleCopy(account)}
                          size="small"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-600 text-lg">Balance</p>
                  <p>{balance ? `${balance} ETH` : "Loading..."}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-600 text-lg">User Type</p>
                  <p>{formatUserType(userType)}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-600 text-lg">
                    Connection Status
                  </p>
                  <p>{isConnected ? "Connected" : "Disconnected"}</p>
                </div>
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
