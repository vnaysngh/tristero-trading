"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import PricesPoll from "@/components//PricePoll";
import { initializeTradingService } from "@/lib/api";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  initializeTradingService();

  return (
    <QueryClientProvider client={queryClient}>
      <PricesPoll />
      {children}
    </QueryClientProvider>
  );
}
