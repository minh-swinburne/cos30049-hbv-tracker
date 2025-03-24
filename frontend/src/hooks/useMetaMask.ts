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
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        setState((prev) => ({
          ...prev,
          error: "MetaMask is not installed. Please install MetaMask to continue.",
        }));
        return;
      }

      // Check if MetaMask is locked
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setState({
            isConnected: true,
            account: ethers.getAddress(accounts[0]),
            error: null,
          });
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "MetaMask is locked. Please unlock your wallet to continue.",
        }));
      }
    } catch (error) {
      console.error("Error checking MetaMask connection:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to connect to MetaMask. Please try again.",
      }));
    }
  }, []);

  const connectWallet = async () => {
    console.log("Connecting to MetaMask...");
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

      const account = ethers.getAddress(accounts[0]);
      setState({ isConnected: true, account, error: null });

      // Get provider and signer
      let provider, signer;
      try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to initialize Web3 provider. Please try again.",
        }));
        return;
      }

      // Sign login message
      let signature;
      try {
        // Create a more user-friendly message that clearly explains what's being signed
        const timestamp = new Date().toLocaleString();
        const message = `Welcome to HBV Tracker!\n\nBy signing this message, you confirm that you want to log in to the HBV Tracker application.\n\nThis signature will not trigger a blockchain transaction or cost any gas fees.\n\nTimestamp: ${timestamp}`;
        
        // Add a small delay to ensure MetaMask UI is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          signature = await signer.signMessage(message);
        } catch (signError: any) {
          if (signError.code === 4001) {
            throw { code: 4001, message: "User rejected the signature request" };
          }
          throw signError;
        }

        // Generate JWT token
        try {
          const token = await apiClient.auth.generateToken(account, message, signature);
          localStorage.setItem("access-token", token.accessToken);
          apiClient.baseClient.setAuthorizationToken(token.accessToken);
          setToken(token.accessToken);
        } catch (tokenError) {
          console.error("Token generation error:", tokenError);
          throw new Error("Failed to generate authentication token");
        }
      } catch (error: any) {
        console.error("Signature error:", error);
        if (error.code === 4001) {
          setState((prev) => ({
            ...prev,
            error: "You need to sign the message to log in. Please try again.",
          }));
        } else if (error.message?.includes("authentication token")) {
          setState((prev) => ({
            ...prev,
            error: "Authentication failed. Please try again.",
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: "Failed to complete login. Please make sure your MetaMask is unlocked and try again.",
          }));
        }
        return;
      }

      // Check user roles
      try {
        const [isProvider, isResearcher] = await Promise.all([
          apiClient.blockchain.checkProviderRegistration(account),
          apiClient.blockchain.checkResearcherRegistration(account),
        ]);

        if (isProvider.authorized) {
          setUserType("healthcareProvider");
        } else if (isResearcher.authorized) {
          setUserType("researcher");
        } else {
          setUserType("patient");
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to verify account type. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error in MetaMask connection process:", error);
      setState((prev) => ({
        ...prev,
        error: "An unexpected error occurred. Please try again.",
      }));
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
