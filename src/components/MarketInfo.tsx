import React from "react";
import { MarketData } from "@/types/trading";
import { formatPrice } from "@/lib/api";

export const MarketInfo = ({
  market,
  selectedSymbol,
  currentPrice
}: {
  market: MarketData | undefined;
  selectedSymbol: string;
  currentPrice: string;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Market Information
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Symbol</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {market?.name || selectedSymbol || "Loading..."}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Max Leverage
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {market?.maxLeverage || 10 || "Loading..."}x
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current Price
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {currentPrice
              ? `$${formatPrice(parseFloat(currentPrice))}`
              : "Loading..."}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Size Decimals
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {market?.szDecimals || 4 || "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};
