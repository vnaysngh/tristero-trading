"use client";

import {
  useMarketData as useMarketDataQuery,
  usePriceData as usePriceDataQuery,
  usePositions as usePositionsQuery,
  useClosePosition as useClosePositionMutation,
  useAccountData as useAccountDataQuery,
  usePlaceOrder as usePlaceOrderMutation,
  useTradeHistory as useTradeHistoryQuery,
  usePriceHistory as usePriceHistoryQuery,
  usePortfolio as usePortfolioQuery
} from "./useMarketQueries";

export function useMarketData() {
  const { data, isLoading, error, refetch } = useMarketDataQuery();

  return {
    markets: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function usePriceData() {
  const { data, isLoading, error, refetch } = usePriceDataQuery();

  return {
    prices: data || {},
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function usePositions(walletAddress: string) {
  const { data, isLoading, error, refetch } = usePositionsQuery(walletAddress);

  return {
    positions: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function useClosePosition(walletAddress: string) {
  const { mutateAsync, isPending, error, isSuccess, reset } =
    useClosePositionMutation(walletAddress);

  return {
    closePosition: mutateAsync,
    isClosing: isPending,
    closeError: error?.message || null,
    closeSuccess: isSuccess,
    reset: reset
  };
}

export function useAccountData(userAddress: string) {
  const { data, isLoading, error, refetch } = useAccountDataQuery(userAddress);

  return {
    accountData: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function useTradeHistory(walletAddress: string) {
  const { data, isLoading, error, refetch } =
    useTradeHistoryQuery(walletAddress);

  return {
    closedPositions: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function usePlaceOrder(walletAddress: string) {
  const { mutateAsync, isPending, error, isSuccess, reset } =
    usePlaceOrderMutation(walletAddress);

  return {
    placeOrder: mutateAsync,
    isPlacing: isPending,
    orderError: error?.message || null,
    orderSuccess: isSuccess,
    reset: reset
  };
}

export function usePriceHistory(ticker: string, interval: string) {
  const { data, isLoading, error, refetch } = usePriceHistoryQuery(
    ticker,
    interval
  );

  return {
    priceHistory: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function usePortfolio(walletAddress: string) {
  const { data, isLoading, error, refetch } = usePortfolioQuery(walletAddress);

  return {
    portfolio: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}
