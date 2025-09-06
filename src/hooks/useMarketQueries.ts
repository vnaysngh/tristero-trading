"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMarketData,
  getAllPrices,
  initializeTradingService,
  getAccountData,
  placeOrder,
  getPriceHistory,
  getPortfolio
} from "@/lib/api";
import { tradingService } from "@/lib/trading-service";
import { PlaceOrderRequest } from "@/types/trading";

export function useMarketData() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const response = await getMarketData();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch market data");
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3
  });
}

export function usePriceData() {
  return useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      const response = await getAllPrices();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch price data");
    },
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: 3,
    refetchInterval: 5 * 1000
  });
}

export function usePositions(walletAddress: string) {
  return useQuery({
    queryKey: ["positions", walletAddress],
    queryFn: async () => {
      const result = await tradingService.getClearinghouseState(walletAddress);

      if (result.success && result.data?.assetPositions) {
        // Filter out positions with zero size
        const activePositions = result.data.assetPositions.filter(
          (pos: any) => parseFloat(pos.position.szi || "0") !== 0
        );
        return activePositions;
      }

      throw new Error(result.error || "Failed to fetch positions");
    },
    enabled: !!walletAddress && walletAddress.length > 0,
    staleTime: Infinity,
    gcTime: 2 * 60 * 1000,
    retry: false
  });
}

export function useClosePosition(walletAddress: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coin: string) => {
      const initResult = await initializeTradingService();
      if (!initResult.success) {
        throw new Error(
          initResult.error || "Failed to initialize trading service"
        );
      }

      const result = await tradingService.closePosition(coin);

      if (!result.success) {
        throw new Error(result.error || `Failed to close position ${coin}`);
      }

      return { coin, message: `Position ${coin} closed successfully!` };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["positions", walletAddress] });
    },
    onError: (error) => {
      console.error("Error closing position:", error);
    }
  });
}

export function useAccountData(userAddress: string) {
  return useQuery({
    queryKey: ["accountData", userAddress],
    queryFn: async () => {
      const response = await getAccountData(userAddress);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch account data");
    },
    enabled: !!userAddress && userAddress.length > 0,
    staleTime: 10 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000
  });
}

export function useTradeHistory(walletAddress: string) {
  return useQuery({
    queryKey: ["closedPositions", walletAddress],
    queryFn: async () => {
      const result = await tradingService.getUserFills(walletAddress);

      if (result.success && result.data) {
        return result.data;
      }

      throw new Error(result.error || "Failed to fetch closed positions");
    },
    enabled: !!walletAddress && walletAddress.length > 0,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: false
  });
}

export function usePlaceOrder(walletAddress: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: PlaceOrderRequest) => {
      const response = await placeOrder(request);

      if (!response.success) {
        throw new Error(response.error || "Failed to place order");
      }

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["accountData", walletAddress]
      });
      queryClient.invalidateQueries({ queryKey: ["positions", walletAddress] });
    },
    onError: (error) => {
      console.error("Error placing order:", error);
    }
  });
}

export function usePriceHistory(ticker: string, interval: string) {
  return useQuery({
    queryKey: ["priceHistory", ticker, interval],
    queryFn: async () => {
      const startTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
      const response = await getPriceHistory(ticker, interval, startTime);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || "Failed to fetch price history");
    },
    enabled: !!ticker && !!interval,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3
  });
}

export function usePortfolio(walletAddress: string) {
  return useQuery({
    queryKey: ["portfolio", walletAddress],
    queryFn: async () => {
      const response = await getPortfolio(walletAddress);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch portfolio data");
    },
    enabled: !!walletAddress && walletAddress.length > 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false
  });
}
