"use client";

import { useState } from "react";
import { usePositions, useClosePosition } from "@/hooks/useMarket";
import PositionsTable from "./PositionsTable";
import { tableHeaders } from "@/constants";

/* interface Position {
  coin: string;
  originalCoin: string;
  size: string;
  positionValue: string;
  entryPrice: string;
  markPrice: string;
  pnl: string;
  roe: string;
  liqPrice: string;
  margin: string;
} */

export default function Positions() {
  const [closingPositions, setClosingPositions] = useState<Set<string>>(
    new Set()
  );

  const {
    positions,
    loading,
    error,
    refetch: refetchPositions
  } = usePositions();

  const {
    closePosition,
    isClosing,
    closeError,
    closeSuccess,
    reset: resetCloseState
  } = useClosePosition();

  const handleClosePositionWrapper = async (coin: string) => {
    setClosingPositions((prev) => new Set(prev).add(coin));

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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading positions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            Failed to load positions
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={() => refetchPositions()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {closeError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-3 flex justify-between items-center">
          <span>{closeError}</span>
          <button
            onClick={resetCloseState}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}
      {closeSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-6 py-3 flex justify-between items-center">
          <span>Position closed successfully!</span>
          <button
            onClick={resetCloseState}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            ×
          </button>
        </div>
      )}

      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Open Positions
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              refetchPositions();
              resetCloseState();
            }}
            disabled={loading || isClosing}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || isClosing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {positions.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">No open positions yet</p>
                    <p className="text-sm mt-1">
                      Start trading to see your positions here
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              positions.map((position: any) => (
                <PositionsTable
                  key={position.position.coin}
                  closingPositions={closingPositions}
                  position={position.position}
                  handleClosePosition={handleClosePositionWrapper}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
