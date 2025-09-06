import React from "react";
import { useAppState } from "@/state/store";
import { useMarketData } from "@/hooks/useMarket";
import { formatPrice } from "@/utils";

export const MarketInfo = () => {
  const { markets } = useMarketData();
  const ticker = useAppState((s) => s.ticker);
  const market = markets.find((m) => m.name === ticker);
  const currentPrice = useAppState((s) => s.prices[ticker]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Market Information
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Symbol</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {market?.name || ticker || "Loading..."}
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
