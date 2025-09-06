import { useDebounce } from "@/hooks/useDebounce";
import React, { useState, useEffect, useMemo } from "react";
import { useMarketData, usePriceData } from "@/hooks/useMarket";
import { useAppState } from "@/state/store";
import MarketDropdown from "./MarketDropdown";
import MarketPrice from "./MarketPrice";
import { Interval, MarketData, MarketSelectProps } from "@/types";
import { INTERVALS } from "@/constants";
import { ChevronDownIcon } from "../../Icons";
import SearchInput from "./SearchInput";
import DropdownContent from "./DropdownContent";
import IntervalButton from "./IntervalsButton";

const DROPDOWN_CLASSES =
  "asset-dropdown absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden";

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
            <ChevronDownIcon className={chevronClasses} />
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
