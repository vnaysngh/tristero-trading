"use client";

import { useState, useEffect, useCallback } from "react";
import { getMarketData, getAllPrices } from "@/lib/api";
import { MarketData, PriceData } from "@/types/trading";

// Global cache to prevent duplicate requests
const dataCache = {
  markets: null as MarketData[] | null,
  prices: null as PriceData | null,
  lastMarketFetch: 0,
  lastPriceFetch: 0
};

const CACHE_DURATION = {
  markets: 30000, // 30 seconds for market data (changes less frequently)
  prices: 5000 // 5 seconds for price data
};

export function useMarketData() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    const now = Date.now();

    if (
      dataCache.markets &&
      now - dataCache.lastMarketFetch < CACHE_DURATION.markets
    ) {
      setMarkets(dataCache.markets);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getMarketData();
      console.log(response, "response");
      if (response.success && response.data) {
        dataCache.markets = response.data;
        dataCache.lastMarketFetch = now;
        setMarkets(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch market data");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching market data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  return { markets, loading, error, refetch: fetchMarkets };
}

export function usePriceData() {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    const now = Date.now();

    if (
      dataCache.prices &&
      now - dataCache.lastPriceFetch < CACHE_DURATION.prices
    ) {
      setPrices(dataCache.prices);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getAllPrices();
      if (response.success && response.data) {
        dataCache.prices = response.data;
        dataCache.lastPriceFetch = now;
        setPrices(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch price data");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching price data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, CACHE_DURATION.prices);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}
