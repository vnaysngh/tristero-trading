// components/PricesPoller.tsx
"use client";

import { useEffect } from "react";
import { useAppState } from "@/state/store"; // adjust import to your store path
import { usePriceData } from "@/hooks/useMarket";

export default function PricesPoller() {
  const setPrices = useAppState((s) => s.setPrices);

  const { loading: priceLoading, prices } = usePriceData();

  useEffect(() => {
    if (!prices) return;

    setPrices(prices);
  }, [prices, priceLoading]);
  return null;
}
