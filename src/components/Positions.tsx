"use client";

import { useState } from "react";
import { usePositions, useClosePosition } from "@/hooks/useMarket";
import PositionsTable from "./PositionsTable";
import { useAppState } from "@/state/store";
import { WarningIcon, BarChartIcon } from "./Icons";

const headers = [
  "Coin",
  "Size",
  "Position Value",
  "Entry Price",
  "Mark Price",
  "PNL (ROE%)",
  "Liq. Price",
  "Margin",
  "Close All"
];

const LoadingState = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-8 text-center">
      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">Loading positions...</p>
    </div>
  </div>
);

const ErrorState = ({
  error,
  onRetry
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
        <WarningIcon />
      </div>
      <p className="text-red-600 dark:text-red-400 font-medium mb-2">
        Failed to load positions
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const NotificationBanner = ({
  type,
  message,
  onClose
}: {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}) => {
  const isError = type === "error";
  const baseClasses = "border-b px-6 py-3 flex justify-between items-center";
  const typeClasses = isError
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400";

  const buttonClasses = isError
    ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
    : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button onClick={onClose} className={buttonClasses}>
        ×
      </button>
    </div>
  );
};

const EmptyState = () => (
  <tr>
    <td colSpan={headers.length} className="px-6 py-12 text-center">
      <div className="text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <BarChartIcon />
        </div>
        <p className="text-lg font-medium">No open positions yet</p>
        <p className="text-sm mt-1">Start trading to see your positions here</p>
      </div>
    </td>
  </tr>
);

const TableHeader = () => (
  <thead className="bg-gray-50 dark:bg-gray-900">
    <tr>
      {headers.map((header) => (
        <th
          key={header}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

export default function Positions() {
  const walletAddress = useAppState((s) => s.walletAddress);
  const [closingPositions, setClosingPositions] = useState<Set<string>>(
    new Set()
  );

  const {
    positions,
    loading,
    error,
    refetch: refetchPositions
  } = usePositions(walletAddress);

  const {
    closePosition,
    isClosing,
    closeError,
    closeSuccess,
    reset: resetCloseState
  } = useClosePosition(walletAddress);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetchPositions} />;
  }

  const handleClosePosition = async (coin: string) => {
    setClosingPositions((prev) => {
      const newSet = new Set(prev);
      newSet.add(coin);
      return newSet;
    });

    try {
      await closePosition(coin);
    } catch (error) {
      console.error("Error closing position:", error);
    } finally {
      setClosingPositions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(coin);
        return newSet;
      });
    }
  };

  const handleRefresh = () => {
    refetchPositions();
    resetCloseState();
  };

  const isRefreshing = loading || isClosing;
  const hasPositions = positions.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {closeError && (
        <NotificationBanner
          type="error"
          message={closeError}
          onClose={resetCloseState}
        />
      )}

      {closeSuccess && (
        <NotificationBanner
          type="success"
          message="Position closed successfully!"
          onClose={resetCloseState}
        />
      )}

      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Open Positions
        </h2>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRefreshing ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader />
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {!hasPositions ? (
              <EmptyState />
            ) : (
              positions.map((position: any) => (
                <PositionsTable
                  key={position.position.coin}
                  position={position.position}
                  closingPositions={closingPositions}
                  handleClosePosition={handleClosePosition}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
