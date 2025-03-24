import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import apiClient from "../api"; // Import the API client
import { useStore } from "../store"; // Import the global store

interface MetaMaskState {
  isConnected: boolean;
  account: string | null;
  error: string | null;
}

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    account: null,
    error: null,
  });

  const { setToken, setUserType } = useStore(); // Access global store actions

  const checkConnection = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({ ...prev, error: "Please install MetaMask!" }));
        return;
      }

      // Prevent automatic reconnection if no token is stored
      // const storedToken = localStorage.getItem("access-token");
      // if (!storedToken) {
      //   setState({
      //     isConnected: false,
      //     account: null,
      //     error: null,
      //   });
      //   return;
      // }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setState({
          isConnected: true,
          account: ethers.getAddress(accounts[0]), // Convert to checksum address
          error: null,
        });
      }
    } catch (error) {
      console.error("Error checking MetaMask connection:", error);
      setState((prev) => ({ ...prev, error: "Error connecting to MetaMask" }));
    }
  }, []);

  const connectWallet = async () => {
    console.log("Connecting to MetaMask...");
    try {
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({ ...prev, error: "Please install MetaMask!" }));
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = ethers.getAddress(accounts[0]); // Convert to checksum address
      setState({ isConnected: true, account, error: null });

      // Step 1: Sign login message
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `I am logging into the HBV Tracker on ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      // Step 2: Generate JWT token
      const token = await apiClient.auth.generateToken(message, signature);
      localStorage.setItem("access-token", token.accessToken);
      apiClient.baseClient.setAuthorizationToken(token.accessToken);
      setToken(token.accessToken);

      // Step 3: Check user roles
      const isProvider = await apiClient.blockchain.checkProviderRegistration(
        account
      );
      const isResearcher =
        await apiClient.blockchain.checkResearcherRegistration(account);

      console.log("isProvider", isProvider);
      console.log("isResearcher", isResearcher);

      if (isProvider.authorized) {
        setUserType("healthcareProvider");
      } else if (isResearcher.authorized) {
        setUserType("researcher");
      } else {
        setUserType("patient");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setState((prev) => ({ ...prev, error: "Error connecting to MetaMask" }));
    }
  };

  const disconnectWallet = async () => {
    setState({
      isConnected: false,
      account: null,
      error: null,
    });
    localStorage.removeItem("access-token"); // Clear stored token
    apiClient.baseClient.clearAuthorizationToken(); // Remove authorization token

    // Try to revoke permissions in MetaMask
    if (window.ethereum && window.ethereum.request) {
      try {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        console.log("Wallet permissions revoked.");
      } catch (error) {
        console.error("Failed to revoke permissions:", error);
      }
    }
  };

  useEffect(() => {
    checkConnection();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState({
          isConnected: false,
          account: null,
          error: null,
        });
      } else {
        setState({
          isConnected: true,
          account: ethers.getAddress(accounts[0]), // Convert to checksum address
          error: null,
        });
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [checkConnection]);

  return {
    ...state,
    connectWallet,
    disconnectWallet, // Expose disconnectWallet
  };
};
