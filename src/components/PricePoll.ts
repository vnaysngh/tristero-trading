"use client";

import { useEffect } from "react";
import { useAppState } from "@/state/store";
import { usePriceData } from "@/hooks/useMarket";

export default function PricePoll() {
  const setPrices = useAppState((s) => s.setPrices);

  const { loading: priceLoading, prices } = usePriceData();

  useEffect(() => {
    if (!prices) return;

    setPrices(prices);
  }, [prices, priceLoading]);
  return null;
}
