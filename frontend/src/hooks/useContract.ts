import { ethers } from "ethers";
import { useMemo } from "react";
import contractABI from "../../contract_abi.json";

export const useContract = () => {
  const rpcUrl = import.meta.env.VITE_BLOCKCHAIN_RPC_URL;
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);
  const contract = useMemo(
    () => new ethers.Contract(contractAddress, contractABI, provider),
    [contractAddress, provider]
  );

  const connectWithSigner = async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed. Please install MetaMask!");
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();
    return contract.connect(signer);
  };

  return {
    contract,
    connectWithSigner,
  };
};
