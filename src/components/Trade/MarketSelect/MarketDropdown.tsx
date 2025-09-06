import { useAppState } from "@/state/store";
import React from "react";
import { MarketData } from "@/types";
import { formatPrice } from "@/utils";

const MarketDropdown = ({
  market,
  handleAssetSelect,
  ticker
}: {
  market: MarketData;
  handleAssetSelect: (symbol: string) => void;
  ticker: string;
}) => {
  const currentPrice = useAppState((s) => s.prices[market.name]);
  return (
    <button
      key={market.name}
      onClick={() => handleAssetSelect(market.name)}
      className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        market.name === ticker
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          : "text-gray-900 dark:text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
            {market.name.charAt(0)}
          </div>
          <span className="font-medium">{market.name}</span>
        </div>
        {currentPrice && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ${formatPrice(currentPrice)}
          </span>
        )}
      </div>
    </button>
  );
};

export default MarketDropdown;
