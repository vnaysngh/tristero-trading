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
            throwOnError: true
          },
          mutations: {
            throwOnError: true,
            retry: false
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
