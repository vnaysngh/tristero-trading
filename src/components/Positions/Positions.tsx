"use client";

import { useState } from "react";
import { usePositions, useClosePosition } from "@/hooks/useMarket";
import { useAppState } from "@/state/store";
import LoadingState from "../common/LoadingState";
import ErrorState from "./ErrorState";
import NotificationBanner from "./NotificationBanner";
import EmptyState from "../common/EmptyState";
import TableHeader from "../common/TableHeader";
import PositionsTableBody from "./PositionsTableBody";

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
    return <LoadingState message="Loading positions..." />;
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
          <TableHeader headers={headers} />
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {!hasPositions ? (
              <EmptyState
                title={
                  !walletAddress ? "Connect Wallet" : "No open positions yet"
                }
                description="Start trading to see your positions here"
                colSpan={headers.length}
              />
            ) : (
              positions.map((position: any) => (
                <PositionsTableBody
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
