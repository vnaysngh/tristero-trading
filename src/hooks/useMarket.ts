"use client";

import {
  useMarketData as useMarketDataQuery,
  usePriceData as usePriceDataQuery,
  usePortfolioData as usePortfolioDataQuery
} from "./useMarketQueries";

export function useMarketData() {
  const query = useMarketDataQuery();

  return {
    markets: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch
  };
}

export function usePriceData() {
  const query = usePriceDataQuery();

  return {
    prices: query.data || {},
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch
  };
}

export function usePortfolioData() {
  const query = usePortfolioDataQuery();

  return {
    portfolio: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch
  };
}

export function clearDataCache() {
  // React Query handles caching automatically, so this function is no longer needed
  // but we keep it for backward compatibility
  console.warn(
    "clearDataCache is deprecated when using React Query. Caching is handled automatically."
  );
}
