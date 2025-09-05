"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMarketData,
  getAllPrices,
  getPortfolioData,
  initializeTradingService,
  getAccountData,
  placeOrder,
  PlaceOrderRequest
} from "@/lib/api";
import { useAppState } from "@/state/store";
import { tradingService } from "@/lib/trading-service";
import { USER_ADDRESS } from "@/constants";

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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    refetchInterval: 5 * 1000 // Refetch every 5 seconds
  });
}

export function usePortfolioData() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const response = await getPortfolioData();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch portfolio data");
    },
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    refetchInterval: 10 * 1000 // Refetch every 10 seconds
  });
}

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const result = await tradingService.getClearinghouseState(USER_ADDRESS);

      if (result.success && result.data?.assetPositions) {
        // Filter out positions with zero size
        const activePositions = result.data.assetPositions.filter(
          (pos: any) => parseFloat(pos.position.szi || "0") !== 0
        );
        return activePositions;
      }

      throw new Error(result.error || "Failed to fetch positions");
    },
    staleTime: 5 * 1000, // 5 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    refetchInterval: 10 * 1000 // Refetch every 10 seconds
  });
}

export function useClosePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coin: string) => {
      const initResult = await initializeTradingService();
      if (!initResult.success) {
        throw new Error(
          initResult.error || "Failed to initialize trading service"
        );
      }

      // Close the position
      const result = await tradingService.closePosition(coin);

      if (!result.success) {
        throw new Error(result.error || `Failed to close position ${coin}`);
      }

      return { coin, message: `Position ${coin} closed successfully!` };
    },
    onSuccess: (data) => {
      // Invalidate and refetch positions data
      queryClient.invalidateQueries({ queryKey: ["positions"] });
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
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    refetchInterval: 30 * 1000 // Refetch every 30 seconds
  });
}

export function usePlaceOrder() {
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
      // Invalidate and refetch account data and positions
      queryClient.invalidateQueries({ queryKey: ["accountData"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
    onError: (error) => {
      console.error("Error placing order:", error);
    }
  });
}
