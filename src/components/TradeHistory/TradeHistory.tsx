"use client";

import { useTradeHistory } from "@/hooks/useMarket";
import { formatPrice, formatTradeTime } from "@/utils";
import { ProcessedPosition, RawFill } from "@/types/trading";
import { useAppState } from "@/state/store";
import EmptyState from "../common/EmptyState";
import LoadingState from "../common/LoadingState";
import TableHeader from "../common/TableHeader";
import { TradeHistoryBody } from "./TradeHistoryBody";

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

export function TradeHistory() {
  const walletAddress = useAppState((s) => s.walletAddress);
  const { closedPositions, loading, error, refetch } =
    useTradeHistory(walletAddress);

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

  function renderPositionRow(position: ProcessedPosition) {
    return <TradeHistoryBody key={position.tid} position={position} />;
  }

  function renderTableBody() {
    return (
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {processedPositions.length === 0 ? (
          <EmptyState
            title="No trade history yet"
            description="Trade history will appear here after you make trades"
            colSpan={headers.length}
          />
        ) : (
          processedPositions.map(renderPositionRow)
        )}
      </tbody>
    );
  }

  if (loading) {
    return <LoadingState message="Loading trade history..." />;
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
          <TableHeader headers={headers} />
          {renderTableBody()}
        </table>
      </div>
    </div>
  );
}
