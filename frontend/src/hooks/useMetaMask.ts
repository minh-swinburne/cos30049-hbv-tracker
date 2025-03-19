import { useState, useEffect, useCallback } from 'react';

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

  const checkConnection = useCallback(async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setState(prev => ({ ...prev, error: 'Please install MetaMask!' }));
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length > 0) {
        setState({
          isConnected: true,
          account: accounts[0],
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
      setState(prev => ({ ...prev, error: 'Error connecting to MetaMask' }));
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setState(prev => ({ ...prev, error: 'Please install MetaMask!' }));
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setState({
        isConnected: true,
        account: accounts[0],
        error: null,
      });
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setState(prev => ({ ...prev, error: 'Error connecting to MetaMask' }));
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
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [checkConnection]);

  return {
    ...state,
    connectWallet,
  };
}; 