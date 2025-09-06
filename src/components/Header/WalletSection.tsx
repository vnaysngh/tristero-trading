import { LoadingSpinner, WalletIcon } from "../Icons";

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

export default WalletSection;
