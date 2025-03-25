import { ethers } from "ethers";
import { useCallback, useState } from "react";
import apiClient from "../api"; // Import the API client
import { useStore } from "../store"; // Import the global store

interface MetaMaskState {
  isConnected: boolean;
  account: string | null;
  error: string | null;
  userType: "healthcareProvider" | "researcher" | "patient" | null;
}

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    account: null,
    error: null,
    userType: null,
  });

  const { user, setToken, setUserType, clearToken, clearUserType } = useStore(); // Access global store actions

  const checkConnection = useCallback(async () => {
    console.log("Checking MetaMask connection...");
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({
          ...prev,
          error:
            "MetaMask is not installed. Please install MetaMask to continue.",
        }));
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      console.log("MetaMask account:", accounts);
      console.log("User account:", user); // This will now reflect the latest user value
      if (accounts.length > 0 && user) {
      // if (accounts.length > 0) {
        const account = ethers.getAddress(accounts[0]);

        if (account !== user.sub) {
          console.log(
            "MetaMask account does not match user account. Disconnecting..."
          );
          localStorage.removeItem("access-token");
          apiClient.baseClient.clearAuthorizationToken();
          clearToken();
          clearUserType();
          return;
        }

        console.log("MetaMask account matches user account. Proceeding...");
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account,
          error: null,
        }));
        console.log("Connection status:", state.isConnected);

        // Check user type if connected
        const isProvider = await apiClient.blockchain.checkProviderRegistration(
          account
        );
        const isResearcher =
          await apiClient.blockchain.checkResearcherRegistration(account);

        let userType: "healthcareProvider" | "researcher" | "patient";
        if (isProvider.authorized) {
          userType = "healthcareProvider";
        } else if (isResearcher.authorized) {
          userType = "researcher";
        } else {
          userType = "patient";
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
  }, [setUserType, user]); // Include `user` in the dependency array

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({
          ...prev,
          error:
            "MetaMask is not installed. Please install MetaMask to continue.",
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

      // Step 1: Sign wallet message
      let message: string;
      let signature: string;
      let account: string;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        message = `I am logging into the HBV Tracker on ${new Date().toISOString()}`;
        signature = await signer.signMessage(message);
        account = ethers.getAddress(accounts[0]);
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account,
          error: null,
        }));
      } catch (error) {
        console.error("Error signing message:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to sign message. Please try again.",
        }));
        return;
      }

      // Step 2: Generate JWT token
      try {
        const token = await apiClient.auth.generateToken(
          account,
          message,
          signature
        );
        localStorage.setItem("access-token", token.accessToken);
        apiClient.baseClient.setAuthorizationToken(token.accessToken);
        setToken(token.accessToken);
      } catch (tokenError) {
        console.error("Error generating token:", tokenError);
        setState((prev) => ({
          ...prev,
          error: "Failed to generate token. Please try again.",
        }));
      }

      // Step 3: Check user roles
      const isProvider = await apiClient.blockchain.checkProviderRegistration(
        account
      );
      const isResearcher =
        await apiClient.blockchain.checkResearcherRegistration(account);

      let userType: "healthcareProvider" | "researcher" | "patient";
      if (isProvider.authorized) {
        userType = "healthcareProvider";
      } else if (isResearcher.authorized) {
        userType = "researcher";
      } else {
        userType = "patient";
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

  const getBalance = useCallback(async () => {
    if (!state.account || typeof window.ethereum === "undefined") {
      return null;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(state.account);
      return ethers.formatEther(balance); // Convert balance to Ether
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  }, [state.account]);

  // useEffect(() => {
  //   checkConnection();
  // }, [checkConnection]);

  return {
    ...state,
    checkConnection,
    connectWallet,
    disconnect,
    getBalance, // Expose the getBalance function
  };
};
