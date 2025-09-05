import { memo } from "react";

const Balances = memo(
  ({
    loadingBalance,
    accountValues,
    refetchAccount,
    formData
  }: {
    loadingBalance: boolean;
    accountValues: any;
    refetchAccount: () => void;
    formData: any;
  }) => {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Available to Trade
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {loadingBalance ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `$${accountValues.usdcBalance}`
              )}
            </span>
            <button
              type="button"
              onClick={() => refetchAccount()}
              disabled={loadingBalance}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
            >
              {loadingBalance ? "..." : "↻"}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current Position
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {loadingBalance ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${accountValues.positionSize} ${formData.coin || "ETH"}`
            )}
          </span>
        </div>
      </div>
    );
  }
);

export default Balances;
