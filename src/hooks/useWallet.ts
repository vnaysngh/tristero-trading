"use client";

import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import "@/types/ethereum";

interface WalletState {
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: "",
    isConnected: false,
    isConnecting: false,
    error: null
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        setWalletState({
          address: accounts[0].address,
          isConnected: true,
          isConnecting: false,
          error: null
        });
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setWalletState((prev) => ({
        ...prev,
        error:
          "No wallet found. Please install MetaMask or another Web3 wallet.",
        isConnecting: false
      }));
      return;
    }

    setWalletState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null
    }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setWalletState({
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setWalletState((prev) => ({
        ...prev,
        error: error.message || "Failed to connect wallet",
        isConnecting: false
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      address: "",
      isConnected: false,
      isConnecting: false,
      error: null
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    truncateAddress
  };
}
