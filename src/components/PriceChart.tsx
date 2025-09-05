"use client";

import { useState, useEffect } from "react";
import { getPriceHistory, formatPrice } from "@/lib/api";
import { CandleData } from "@/types/trading";
import { useAppState } from "@/state/store";

function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="flex justify-between mt-4">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

function CandlestickChart({ data }: { data: CandleData }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No chart data available
      </div>
    );
  }

  const bars = data.slice(-50); // Show last 50 candles
  const maxPrice = Math.max(...bars.map((bar) => parseFloat(bar.h)));
  const minPrice = Math.min(...bars.map((bar) => parseFloat(bar.l)));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="space-y-4">
      <div className="relative h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 200"
          className="overflow-visible"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={200 * ratio}
              x2="800"
              y2={200 * ratio}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300 dark:text-gray-600"
            />
          ))}

          {bars.map((bar, index: number) => {
            const x = (index / (bars.length - 1)) * 800;
            const open = parseFloat(bar.o);
            const high = parseFloat(bar.h);
            const low = parseFloat(bar.l);
            const close = parseFloat(bar.c);

            const isGreen = close >= open;
            const color = isGreen ? "#10b981" : "#ef4444";

            const highY = 200 - ((high - minPrice) / priceRange) * 200;
            const lowY = 200 - ((low - minPrice) / priceRange) * 200;
            const openY = 200 - ((open - minPrice) / priceRange) * 200;
            const closeY = 200 - ((close - minPrice) / priceRange) * 200;

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            const bodyHeightPx = Math.max(bodyHeight, 1);

            return (
              <g key={index}>
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1"
                />

                <rect
                  x={x - 2}
                  y={bodyTop}
                  width="4"
                  height={bodyHeightPx}
                  fill={isGreen ? color : "transparent"}
                  stroke={color}
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute left-0 top-0 text-xs text-gray-500 dark:text-gray-400">
          ${formatPrice(maxPrice)}
        </div>
        <div className="absolute left-0 bottom-0 text-xs text-gray-500 dark:text-gray-400">
          ${formatPrice(minPrice)}
        </div>
      </div>
    </div>
  );
}

// Main chart component
export function PriceChart({ selectedInterval }: { selectedInterval: string }) {
  const [chartData, setChartData] = useState<CandleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ticker = useAppState((s) => s.ticker);

  useEffect(() => {
    if (!ticker) {
      setChartData(null);
      return;
    }

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        const startTime = Date.now() - 24 * 60 * 60 * 1000;
        const response = await getPriceHistory(
          ticker,
          selectedInterval,
          startTime
        );
        if (response.success && response.data) {
          setChartData(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch chart data");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [ticker, selectedInterval]);

  if (!ticker) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📈</div>
          <p>Select an asset to view price chart</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="text-center py-8 text-red-500 dark:text-red-400">
          <div className="text-4xl mb-4">⚠️</div>
          <p>Failed to load chart data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📈</div>
          <p>No chart data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <CandlestickChart data={chartData} />
    </div>
  );
}
