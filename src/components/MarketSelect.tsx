import { useDebounce } from "@/hooks/useDebounce";
import React, { useMemo, useState, useEffect } from "react";
import { formatPrice } from "@/lib/api";
import { useMarketData, usePriceData } from "@/hooks/useMarket";
import { useAppState } from "@/state/store";
import MarketDropdown from "./MarketDropdown";
import MarketPrice from "./MarketPrice";

const MarketSelect = ({
  selectedInterval,
  setSelectedInterval
}: {
  selectedInterval: string;
  setSelectedInterval: (interval: string) => void;
}) => {
  const setPrices = useAppState((s) => s.setPrices);
  const setTicker = useAppState((s) => s.setTicker);
  const ticker = useAppState((s) => s.ticker);

  const { loading: priceLoading, prices } = usePriceData();

  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [assetSearchTerm, setAssetSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(assetSearchTerm, 300);

  const { markets, loading } = useMarketData();

  useEffect(() => {
    if (!prices) return;

    setPrices(prices);
  }, [prices]);

  const filteredMarkets = useMemo(() => {
    if (!markets.length || !prices || loading || priceLoading) return [];

    return markets
      .filter((ticker) => prices[ticker.name])
      .filter((ticker) =>
        ticker.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const priceA = parseFloat(prices[a.name] || "0");
        const priceB = parseFloat(prices[b.name] || "0");
        return priceB - priceA;
      });
  }, [markets, prices, debouncedSearchTerm, loading, priceLoading]);

  const intervals = [
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1d", label: "1 Day" },
    { value: "1w", label: "1 Week" }
  ];

  const handleAssetSelect = (assetName: string) => {
    setTicker(assetName);
    setShowAssetDropdown(false);
    setAssetSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showAssetDropdown && !target.closest(".asset-dropdown")) {
        setShowAssetDropdown(false);
        setAssetSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAssetDropdown]);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowAssetDropdown(!showAssetDropdown)}
            className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span>{ticker}-USDC</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                showAssetDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showAssetDropdown && (
            <div className="asset-dropdown absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={assetSearchTerm}
                    onChange={(e) => setAssetSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search assets..."
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {loading || priceLoading ? (
                  <div className="p-4 text-center text-gray-400">
                    Loading markets...
                  </div>
                ) : filteredMarkets.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No assets found
                  </div>
                ) : (
                  filteredMarkets.map((market) => (
                    <MarketDropdown
                      key={market.name}
                      market={market}
                      handleAssetSelect={handleAssetSelect}
                      ticker={ticker}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <MarketPrice ticker={ticker} />
        </div>
      </div>

      <div className="flex space-x-2">
        {intervals.map((interval) => (
          <button
            key={interval.value}
            onClick={() => setSelectedInterval(interval.value)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedInterval === interval.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {interval.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MarketSelect;
