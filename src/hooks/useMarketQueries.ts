"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketData, getAllPrices, getPortfolioData } from "@/lib/api";

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
