import { useDebounce } from "@/hooks/useDebounce";
import React, { useState, useEffect, useMemo } from "react";
import { useMarketData, usePriceData } from "@/hooks/useMarket";
import { useAppState } from "@/state/store";
import MarketDropdown from "./MarketDropdown";
import MarketPrice from "./MarketPrice";
import { Interval, MarketData, MarketSelectProps } from "@/types/trading";
import { INTERVALS } from "@/constants";

const DROPDOWN_CLASSES =
  "asset-dropdown absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden";

const SearchInput = ({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        placeholder="Search assets..."
        autoFocus
      />
    </div>
  </div>
);

const DropdownContent = ({
  isLoading,
  markets,
  onSelect,
  currentTicker
}: {
  isLoading: boolean;
  markets: MarketData[];
  onSelect: (assetName: string) => void;
  currentTicker: string;
}) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-400">Loading markets...</div>
    );
  }

  if (markets.length === 0) {
    return <div className="p-4 text-center text-gray-400">No assets found</div>;
  }

  return (
    <>
      {markets.map((market) => (
        <MarketDropdown
          key={market.name}
          market={market}
          handleAssetSelect={onSelect}
          ticker={currentTicker}
        />
      ))}
    </>
  );
};

const IntervalButton = ({
  interval,
  isSelected,
  onClick
}: {
  interval: Interval;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const buttonClasses = isSelected
    ? "bg-blue-600 text-white"
    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${buttonClasses}`}
    >
      {interval.label}
    </button>
  );
};

const MarketSelect = ({
  selectedInterval,
  setSelectedInterval
}: MarketSelectProps) => {
  const { loading: priceLoading, prices } = usePriceData();
  const { markets, loading: marketsLoading } = useMarketData();

  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [assetSearchTerm, setAssetSearchTerm] = useState("");

  const setTicker = useAppState((s) => s.setTicker);
  const ticker = useAppState((s) => s.ticker);

  const debouncedSearchTerm = useDebounce(assetSearchTerm, 300);

  const filteredMarkets = useMemo(() => {
    if (!markets.length || !prices || marketsLoading || priceLoading) {
      return [];
    }

    return markets
      .filter((market) => prices[market.name])
      .filter((market) =>
        market.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const priceA = parseFloat(prices[a.name] || "0");
        const priceB = parseFloat(prices[b.name] || "0");
        return priceB - priceA;
      });
  }, [markets, prices, marketsLoading, priceLoading, debouncedSearchTerm]);

  const handleAssetSelect = (assetName: string) => {
    setTicker(assetName);
    setShowAssetDropdown(false);
    setAssetSearchTerm("");
  };

  const toggleDropdown = () => {
    setShowAssetDropdown(!showAssetDropdown);
  };

  const handleIntervalSelect = (intervalValue: string) => {
    setSelectedInterval(intervalValue);
  };

  useEffect(() => {
    if (!showAssetDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".asset-dropdown")) {
        setShowAssetDropdown(false);
        setAssetSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAssetDropdown]);

  const isLoading = marketsLoading || priceLoading;
  const chevronClasses = `w-4 h-4 transition-transform ${
    showAssetDropdown ? "rotate-180" : ""
  }`;

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span>{ticker}-USDC</span>
            <svg
              className={chevronClasses}
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
            <div className={DROPDOWN_CLASSES}>
              <SearchInput
                value={assetSearchTerm}
                onChange={setAssetSearchTerm}
              />

              <div className="max-h-60 overflow-y-auto">
                <DropdownContent
                  isLoading={isLoading}
                  markets={filteredMarkets}
                  onSelect={handleAssetSelect}
                  currentTicker={ticker}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <MarketPrice ticker={ticker} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {INTERVALS.map((interval) => (
          <IntervalButton
            key={interval.value}
            interval={interval}
            isSelected={selectedInterval === interval.value}
            onClick={() => handleIntervalSelect(interval.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketSelect;
