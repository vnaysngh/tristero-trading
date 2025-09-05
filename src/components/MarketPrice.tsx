import { formatPrice } from "@/lib/api";
import { useAppState } from "@/state/store";
import React from "react";

const MarketPrice = ({ ticker }: { ticker: string }) => {
  const currentPrice = useAppState((s) => s.prices[ticker]);
  return (
    <div className="text-lg font-bold text-cyan-500 dark:text-cyan-400">
      {currentPrice
        ? `$${formatPrice(parseFloat(currentPrice))}`
        : "Loading..."}
    </div>
  );
};

export default MarketPrice;
