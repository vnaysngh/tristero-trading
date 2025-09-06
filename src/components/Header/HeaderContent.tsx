import Navigation from "./Navigation";
import ThemeToggle from "./ThemeToggle";
import WalletSection from "./WalletSection";
import { Theme } from "@/types";

const ErrorBanner = ({ error }: { error: string }) => (
  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
  </div>
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
    <div className="flex items-center justify-between flex-wrap gap-2">
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

export default HeaderContent;
