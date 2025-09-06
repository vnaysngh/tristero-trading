"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useAppState } from "@/state/store";
import { useEffect } from "react";
import { Theme } from "@/types/trading";
import { NAV_ITEMS } from "@/constants";

const SunIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-5 h-5 text-gray-700 dark:text-gray-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const WalletIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const ThemeToggle = ({
  theme,
  onToggle
}: {
  theme: Theme;
  onToggle: () => void;
}) => {
  const isLight = theme === "light";
  const themeLabel = isLight ? "Light" : "Dark";

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
        title={`Current theme: ${themeLabel}`}
      >
        {!isLight ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
};

const WalletSection = ({
  isConnected,
  address,
  isConnecting,
  truncateAddress,
  onConnect,
  onDisconnect
}: {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  truncateAddress: (address: string) => string;
  onConnect: () => void;
  onDisconnect: () => void;
}) => {
  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg text-sm font-medium">
          {truncateAddress(address)}
        </div>
        <button
          onClick={onDisconnect}
          className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
    >
      {isConnecting ? (
        <>
          <LoadingSpinner />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <WalletIcon />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
};

const ErrorBanner = ({ error }: { error: string }) => (
  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
  </div>
);

const Navigation = ({ currentPath }: { currentPath: string }) => (
  <nav className="mt-6">
    <div className="flex space-x-8">
      {NAV_ITEMS.map((item) => {
        const isActive = currentPath === item.href;
        const linkClasses = isActive
          ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors duration-200 ${linkClasses}`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  </nav>
);

const HeaderContent = ({
  theme,
  onThemeToggle,
  walletProps,
  error,
  pathname
}: {
  theme: Theme;
  onThemeToggle: () => void;
  walletProps: {
    isConnected: boolean;
    address: string | null;
    isConnecting: boolean;
    truncateAddress: (address: string) => string;
    onConnect: () => void;
    onDisconnect: () => void;
  };
  error: string | null;
  pathname: string;
}) => (
  <div className="container mx-auto px-4 pt-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tristero Trading Interface
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Simulated crypto trading with real-time Hyperliquid data
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <WalletSection {...walletProps} />
      </div>
    </div>

    {error && <ErrorBanner error={error} />}

    <Navigation currentPath={pathname} />
  </div>
);

const useTheme = () => {
  const theme = useAppState((s) => s.theme);
  const setTheme = useAppState((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme };
};

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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <HeaderContent
        theme={theme}
        onThemeToggle={toggleTheme}
        walletProps={walletProps}
        error={error}
        pathname={pathname}
      />
    </header>
  );
}
