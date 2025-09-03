"use client";

import { useState, useTransition, useMemo } from "react";
import { useMarketData, usePriceData } from "@/hooks/useMarket";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPrice } from "@/lib/api";
import Link from "next/link";

function MarketListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="space-y-1">
              <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-12 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketItem({
  name,
  price,
  maxLeverage
}: {
  name: string;
  price: string;
  maxLeverage: number;
}) {
  const priceNum = parseFloat(price);
  const isPositive = priceNum >= 0;

  return (
    <Link href={`/markets/${name}`} className="block">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 dark:hover:border-blue-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {name.charAt(0)}
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {name}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-mono text-lg font-semibold ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            ${formatPrice(price)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Max: {maxLeverage}x
          </div>
        </div>
      </div>
    </Link>
  );
}

function SearchBar({
  searchTerm,
  onSearchChange,
  isPending
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
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
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search markets..."
      />
      {isPending && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}

export function MarketList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    markets,
    loading: marketsLoading,
    error: marketsError
  } = useMarketData();
  const { prices, loading: pricesLoading, error: pricesError } = usePriceData();

  const filteredAndSortedMarkets = useMemo(() => {
    if (!markets.length || !prices) return [];

    const filtered = markets
      .filter((market) => prices[market.name])
      .filter(
        (market) =>
          debouncedSearchTerm === "" ||
          market.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const priceA = parseFloat(prices[a.name] || "0");
        const priceB = parseFloat(prices[b.name] || "0");
        return priceB - priceA;
      });

    return filtered.slice(0, 15);
  }, [markets, prices, debouncedSearchTerm]);

  if (marketsLoading || pricesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Markets
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </div>
        <MarketListSkeleton />
      </div>
    );
  }

  if (marketsError || pricesError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Markets
          </h2>
          <div className="text-sm text-red-500 dark:text-red-400">
            Error loading data
          </div>
        </div>
        <div className="text-center py-8 text-red-500 dark:text-red-400">
          <p>Failed to load market data</p>
          <p className="text-sm mt-2">{marketsError || pricesError}</p>
        </div>
      </div>
    );
  }

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Markets
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Real-time prices
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isPending={isPending}
      />

      {filteredAndSortedMarkets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {debouncedSearchTerm
            ? "No markets found matching your search"
            : "No market data available"}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedMarkets.map((market) => (
            <MarketItem
              key={market.name}
              name={market.name}
              price={prices[market.name] || "0"}
              maxLeverage={market.maxLeverage}
            />
          ))}
          {markets.length > 15 && debouncedSearchTerm === "" && (
            <div className="text-center py-4">
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                View all {markets.length} markets
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
