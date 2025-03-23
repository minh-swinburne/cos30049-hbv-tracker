import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
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

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setState({
          isConnected: true,
          account: accounts[0],
          error: null,
        });
      }
    } catch (error) {
      console.error("Error checking MetaMask connection:", error);
      setState((prev) => ({ ...prev, error: "Error connecting to MetaMask" }));
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({ ...prev, error: "Please install MetaMask!" }));
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];
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

      if (isProvider.authorized) {
        setUserType("healthcareProvider");
      } else if (isResearcher.authorized) {
        setUserType("researcher");
      } else {
        setUserType("generalUser");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setState((prev) => ({ ...prev, error: "Error connecting to MetaMask" }));
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
          account: accounts[0],
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
  };
};
