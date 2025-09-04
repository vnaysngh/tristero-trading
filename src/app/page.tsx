"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { PriceChart } from "@/components/PriceChart";
import { MarketTradingForm } from "@/components/TradingForm";

import { formatPrice } from "@/lib/api";

import { useDebounce } from "@/hooks/useDebounce";
import { useMarketData, usePriceData } from "@/hooks/useMarket";

export const dynamic = "force-dynamic";

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState("ETH");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [assetSearchTerm, setAssetSearchTerm] = useState("");

  const { markets, loading: marketsLoading } = useMarketData();
  const { prices } = usePriceData();

  const debouncedSearchTerm = useDebounce(assetSearchTerm, 300);

  const market = markets.find((m) => m.name === selectedSymbol);
  const currentPrice = prices[selectedSymbol];

  const filteredMarkets = useMemo(() => {
    if (!markets.length || !prices) return [];

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
  }, [markets, prices, debouncedSearchTerm]);

  const intervals = [
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1d", label: "1 Day" },
    { value: "1w", label: "1 Week" }
  ];

  const handleAssetSelect = (assetName: string) => {
    setSelectedSymbol(assetName);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                      className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>{selectedSymbol}-USDC</span>
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
                              onChange={(e) =>
                                setAssetSearchTerm(e.target.value)
                              }
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Search assets..."
                              autoFocus
                            />
                          </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                          {marketsLoading ? (
                            <div className="p-4 text-center text-gray-400">
                              Loading markets...
                            </div>
                          ) : filteredMarkets.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">
                              No assets found
                            </div>
                          ) : (
                            filteredMarkets.map((market) => (
                              <button
                                key={market.name}
                                onClick={() => handleAssetSelect(market.name)}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                  market.name === selectedSymbol
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                      {market.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">
                                      {market.name}
                                    </span>
                                  </div>
                                  {prices?.[market.name] && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      ${formatPrice(prices[market.name])}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-cyan-500 dark:text-cyan-400">
                      {currentPrice
                        ? `$${formatPrice(currentPrice)}`
                        : "Loading..."}
                    </div>
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
              <PriceChart coin={selectedSymbol} interval={selectedInterval} />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Market Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Symbol
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {market?.name || selectedSymbol}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Max Leverage
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {market?.maxLeverage || 10}x
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Current Price
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {currentPrice
                      ? `$${formatPrice(currentPrice)}`
                      : "Loading..."}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Size Decimals
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {market?.szDecimals || 4}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <MarketTradingForm
              selectedCoin={selectedSymbol}
              currentPrice={currentPrice}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
