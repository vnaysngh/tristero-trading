"use client";

import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useAppState } from "@/state/store";
import { useEffect } from "react";
import { NetworkStatus } from "../NetworkStatus";
import useTheme from "@/hooks/useTheme";
import HeaderContent from "./HeaderContent";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const {
    address,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    truncateAddress
  } = useWallet();

  const setWalletAddress = useAppState((s) => s.setWalletAddress);

  useEffect(() => {
    setWalletAddress(address);
  }, [address, setWalletAddress]);

  const walletProps = {
    isConnected,
    address,
    isConnecting,
    truncateAddress,
    onConnect: connectWallet,
    onDisconnect: disconnectWallet
  };

  return (
    <>
      <NetworkStatus />
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <HeaderContent
          theme={theme}
          onThemeToggle={toggleTheme}
          walletProps={walletProps}
          error={error}
          pathname={pathname}
        />
      </header>
    </>
  );
}
