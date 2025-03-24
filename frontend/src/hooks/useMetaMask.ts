import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import apiClient from "../api"; // Import the API client
import { useStore } from "../store"; // Import the global store

interface MetaMaskState {
  isConnected: boolean;
  account: string | null;
  error: string | null;
  userType: "healthcareProvider" | "researcher" | "generalUser" | null;
}

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    account: null,
    error: null,
    userType: null,
  });

  const { setToken, setUserType, clearToken, clearUserType } = useStore(); // Access global store actions

  const checkConnection = useCallback(async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({
          ...prev,
          error: "MetaMask is not installed. Please install MetaMask to continue.",
        }));
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account,
          error: null,
        }));

        // Check user type if connected
        const isProvider = await apiClient.blockchain.checkProviderRegistration(account);
        const isResearcher = await apiClient.blockchain.checkResearcherRegistration(account);
        
        let userType: "healthcareProvider" | "researcher" | "generalUser";
        if (isProvider.authorized) {
          userType = "healthcareProvider";
        } else if (isResearcher.authorized) {
          userType = "researcher";
        } else {
          userType = "generalUser";
        }

        setState((prev) => ({
          ...prev,
          userType,
        }));
        setUserType(userType);
      }
    } catch (error) {
      console.error("Error checking MetaMask connection:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to connect to MetaMask. Please try again.",
      }));
    }
  }, [setUserType]);

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({
          ...prev,
          error: "MetaMask is not installed. Please install MetaMask to continue.",
        }));
        return;
      }

      // Request account access
      let accounts;
      try {
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } catch (error: any) {
        // Handle user rejection
        if (error.code === 4001) {
          setState((prev) => ({
            ...prev,
            error: "Please approve the connection request in MetaMask.",
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: "Failed to connect to MetaMask. Please try again.",
          }));
        }
        return;
      }

      const account = accounts[0];
      setState((prev) => ({ ...prev, isConnected: true, account, error: null }));

      // Step 1: Sign login message
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `I am logging into the HBV Tracker on ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      // Step 2: Generate JWT token
      try {
        const token = await apiClient.auth.generateToken(account, message, signature);
        localStorage.setItem("access-token", token.accessToken);
        apiClient.baseClient.setAuthorizationToken(token.accessToken);
        setToken(token.accessToken);
      } catch (tokenError) {
        console.error("Token generation error:", tokenError);
        throw new Error("Failed to generate authentication token");
      }

      // Step 3: Check user roles
      const isProvider = await apiClient.blockchain.checkProviderRegistration(account);
      const isResearcher = await apiClient.blockchain.checkResearcherRegistration(account);

      let userType: "healthcareProvider" | "researcher" | "generalUser";
      if (isProvider.authorized) {
        userType = "healthcareProvider";
      } else if (isResearcher.authorized) {
        userType = "researcher";
      } else {
        userType = "generalUser";
      }

      setState((prev) => ({ ...prev, userType }));
      setUserType(userType);
    } catch (error) {
      console.error("Error in MetaMask connection process:", error);
      setState((prev) => ({
        ...prev,
        error: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  const disconnect = async () => {
    try {
      // Clear local storage and API client token
      localStorage.removeItem("access-token");
      apiClient.baseClient.setAuthorizationToken("");
      
      // Clear global store state
      clearToken();
      clearUserType();

      // Reset local state
      setState({
        isConnected: false,
        account: null,
        error: null,
        userType: null,
      });

      // Disconnect from MetaMask
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          });
        } catch (error) {
          console.error("Error disconnecting from MetaMask:", error);
        }
      }

      // Force page reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error("Error in disconnect process:", error);
      setState((prev) => ({
        ...prev,
        error: "An error occurred while disconnecting. Please try again.",
      }));
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
          userType: null,
        });
        disconnect();
      } else {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
          error: null,
        }));
        checkConnection();
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
    disconnect,
  };
};
