"use client";

import {
  useMarketData as useMarketDataQuery,
  usePriceData as usePriceDataQuery,
  usePortfolioData as usePortfolioDataQuery,
  usePositions as usePositionsQuery,
  useClosePosition as useClosePositionMutation,
  useAccountData as useAccountDataQuery,
  usePlaceOrder as usePlaceOrderMutation
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

export function usePortfolioData() {
  const { data, isLoading, error, refetch } = usePortfolioDataQuery();

  return {
    portfolio: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function usePositions() {
  const { data, isLoading, error, refetch } = usePositionsQuery();

  return {
    positions: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: refetch
  };
}

export function useClosePosition() {
  const { mutateAsync, isPending, error, isSuccess, reset } =
    useClosePositionMutation();

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

export function usePlaceOrder() {
  const { mutateAsync, isPending, error, isSuccess, reset } =
    usePlaceOrderMutation();

  return {
    placeOrder: mutateAsync,
    isPlacing: isPending,
    orderError: error?.message || null,
    orderSuccess: isSuccess,
    reset: reset
  };
}
