"use client";

import { useState, useEffect } from "react";
import { useMarketData, usePriceData } from "@/hooks/useMarket";
import { PriceChart } from "./PriceChart";
import { TradingForm } from "./TradingForm";
import { formatPrice } from "@/lib/api";
import Link from "next/link";

interface MarketDetailsProps {
  symbol: string;
}

export function MarketDetails({ symbol }: MarketDetailsProps) {
  const { markets } = useMarketData();
  const { prices } = usePriceData();
  const [selectedInterval, setSelectedInterval] = useState("1h");

  const market = markets.find((m) => m.name === symbol);
  const currentPrice = prices[symbol];

  if (!market) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Market Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The market "{symbol}" could not be found.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ← Back to Markets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const intervals = [
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1d", label: "1 Day" },
    { value: "1w", label: "1 Week" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Markets
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {market.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Crypto Asset • Max Leverage: {market.maxLeverage}x
                </p>
              </div>
            </div>
            {currentPrice && (
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${formatPrice(currentPrice)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Current Price
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Price Chart
                </h2>
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
              <PriceChart coin={symbol} interval={selectedInterval} />
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
                    {market.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Max Leverage
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {market.maxLeverage}x
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Size Decimals
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {market.szDecimals}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Margin Table
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    #{market.marginTableId}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TradingForm selectedCoin={symbol} />
          </div>
        </div>
      </main>
    </div>
  );
}
