import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import contractABI from "../../contract_abi.json";
import type { EthMessage } from "../types/blockchain";
import type { VaccinationAddress, VaccinationData } from "../types/vaccination";

interface MetaMaskState {
  isConnected: boolean;
  account: string | null;
  error: string | null;
}

console.log("Contract ABI:", contractABI);

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    account: null,
    error: null,
  });

  const rpcUrl = import.meta.env.VITE_BLOCKCHAIN_RPC_URL;
  const chainId = parseInt(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID, 10);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

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

      setState({
        isConnected: true,
        account: accounts[0],
        error: null,
      });
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setState((prev) => ({ ...prev, error: "Error connecting to MetaMask" }));
    }
  };

  const hashVaccinationData = (
    address: VaccinationAddress,
    vaccination: VaccinationData
  ): string => {
    const dataString = `${address.patient}${address.healthcareProvider}${
      vaccination.name
    }${vaccination.date.toISOString()}${vaccination.type}`;
    return ethers.keccak256(ethers.toUtf8Bytes(dataString));
  };

  const signTransaction = async (
    address: VaccinationAddress,
    vaccination: VaccinationData,
    verifyingContract: string
  ): Promise<{ dataHash: string; message: EthMessage; signature: string }> => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed. Please install MetaMask!");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request account access
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    if (
      signerAddress.toLowerCase() !== address.healthcareProvider.toLowerCase()
    ) {
      throw new Error(
        "Connected wallet does not match the healthcare provider address."
      );
    }

    const dataHash: string = hashVaccinationData(address, vaccination);

    const message: EthMessage = {
      domain: {
        name: "HBVTracker",
        version: "1",
        chainId: chainId,
        verifyingContract,
      },
      message: {
        contents: "I authorize storing this vaccination record.",
        patient: address.patient,
        vaccine: vaccination.name,
        date: vaccination.date.toISOString(),
        type: vaccination.type,
      },
      primaryType: "VaccinationRecord",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        VaccinationRecord: [
          { name: "patient", type: "address" },
          { name: "vaccine", type: "string" },
          { name: "date", type: "string" },
          { name: "type", type: "string" },
        ],
      },
    };

    const signature = await provider.send("eth_signTypedData_v4", [
      signerAddress,
      JSON.stringify(message),
    ]);
    return { dataHash, message, signature };
  };

  const storeHash = async (patient: string, dataHash: string) => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed. Please install MetaMask!");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request account access
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.storeHash(patient, ethers.hexlify(dataHash), {
      gasLimit: 200000,
    });

    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed:", tx.hash);
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
    signTransaction,
    storeHash,
  };
};
