"use client";

import { useState } from "react";
import { PriceChart } from "@/components/PriceChart";
import { MarketTradingForm } from "@/components/TradingForm";
import { useMarketData, usePriceData } from "@/hooks/useMarket";
import MarketSelect from "@/components/MarketSelect";
import { MarketInfo } from "@/components/MarketInfo";

export const dynamic = "force-dynamic";

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState("ETH");
  const [selectedInterval, setSelectedInterval] = useState("1h");

  const { markets, loading: marketsLoading } = useMarketData();
  const { prices } = usePriceData();

  const market = markets.find((m) => m.name === selectedSymbol);
  const currentPrice = prices[selectedSymbol];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <MarketSelect
                selectedSymbol={selectedSymbol}
                setSelectedSymbol={setSelectedSymbol}
                selectedInterval={selectedInterval}
                setSelectedInterval={setSelectedInterval}
                loading={marketsLoading}
                markets={markets}
                prices={prices}
                currentPrice={currentPrice}
              />
              <PriceChart
                selectedSymbol={selectedSymbol}
                selectedInterval={selectedInterval}
              />
            </div>
            <MarketInfo
              market={market}
              selectedSymbol={selectedSymbol}
              currentPrice={currentPrice}
            />
          </div>

          <div className="space-y-6">
            <MarketTradingForm
              selectedSymbol={selectedSymbol}
              currentPrice={currentPrice}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
