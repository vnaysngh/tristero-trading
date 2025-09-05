"use client";

import { useClosedPositions } from "@/hooks/useMarket";
import { formatPrice, formatTradeTime } from "@/utils";
import { ProcessedPosition, RawFill } from "@/types/trading";
import { TradeHistoryTable } from "./TradeHistoryTable";
import { useAppState } from "@/state/store";

export function TradeHistory() {
  const walletAddress = useAppState((s) => s.walletAddress);
  const { closedPositions, loading, error, refetch } =
    useClosedPositions(walletAddress);

  function processRawFill(fill: RawFill): ProcessedPosition {
    const price = parseFloat(fill.px);
    const size = parseFloat(fill.sz);
    const tradeValue = price * size;
    const fee = parseFloat(fill.fee);
    const closedPnl = parseFloat(fill.closedPnl);

    return {
      time: formatTradeTime(fill.time),
      coin: fill.coin,
      direction: fill.dir,
      price: formatPrice(price),
      size: `${size.toFixed(4)} ${fill.coin}`,
      tradeValue: `$${formatPrice(tradeValue)} USDC`,
      fee: `$${formatPrice(fee)} USDC`,
      closedPnl: `${closedPnl} USDC`,
      closedPnlValue: closedPnl,
      hash: fill.hash,
      tid: fill.tid
    };
  }

  function handleRefreshClick() {
    refetch();
  }

  function processClosedPositions(rawFills: RawFill[]): ProcessedPosition[] {
    return rawFills.map(processRawFill);
  }

  const processedPositions = processClosedPositions(closedPositions);

  function renderLoadingState() {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading trade history...
          </p>
        </div>
      </div>
    );
  }

  function renderEmptyState() {
    return (
      <tr>
        <td colSpan={8} className="px-6 py-12 text-center">
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
            <p className="text-lg font-medium">No trade history yet</p>
            <p className="text-sm mt-1">
              Trade history will appear here after you make trades
            </p>
          </div>
        </td>
      </tr>
    );
  }

  function renderPositionRow(position: ProcessedPosition) {
    return <TradeHistoryTable key={position.tid} position={position} />;
  }

  function renderTableHeader() {
    const headers = [
      "Time",
      "Coin",
      "Direction",
      "Price",
      "Size",
      "Trade Value",
      "Fee",
      "Closed PNL"
    ];

    return (
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
  }

  function renderTableBody() {
    return (
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {processedPositions.length === 0
          ? renderEmptyState()
          : processedPositions.map(renderPositionRow)}
      </tbody>
    );
  }

  if (loading) {
    return renderLoadingState();
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Trade History
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefreshClick}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>
    </div>
  );
}
