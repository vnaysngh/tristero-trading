"use client";

import { useState, useEffect } from "react";
import { getPriceHistory } from "@/lib/api";
import { CandleBar, CandleData, PriceRange, ChartState } from "@/types/trading";
import { useAppState } from "@/state/store";
import { formatPrice } from "@/utils";
import {
  CHART_DIMENSIONS,
  CANDLES_TO_SHOW,
  GRID_LINES,
  INITIAL_CHART_STATE
} from "@/constants";
import { CHART_TIMEFRAME_MS } from "@/constants";

const COLORS = {
  GREEN: "#10b981",
  RED: "#ef4444",
  GRID: "text-gray-300 dark:text-gray-600"
} as const;

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4" />
      <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="flex justify-between mt-4">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  message,
  submessage
}: {
  icon: string;
  message: string;
  submessage?: string;
}) {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <div className="text-4xl mb-4">{icon}</div>
      <p>{message}</p>
      {submessage && <p className="text-sm mt-2">{submessage}</p>}
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-8 text-red-500 dark:text-red-400">
      <div className="text-4xl mb-4">⚠️</div>
      <p>Failed to load chart data</p>
      <p className="text-sm mt-2">{error}</p>
    </div>
  );
}

function calculatePriceRange(bars: CandleBar[]): PriceRange {
  const max = Math.max(...bars.map((bar) => bar.high));
  const min = Math.min(...bars.map((bar) => bar.low));
  const range = max - min;

  return { max, min, range };
}

function convertToCandleBar(rawBar: any): CandleBar {
  return {
    open: parseFloat(rawBar.o),
    high: parseFloat(rawBar.h),
    low: parseFloat(rawBar.l),
    close: parseFloat(rawBar.c)
  };
}

function calculateCandlePositions(bar: CandleBar, priceRange: PriceRange) {
  const { min, range } = priceRange;
  const { open, high, low, close } = bar;

  const highY =
    CHART_DIMENSIONS.height - ((high - min) / range) * CHART_DIMENSIONS.height;
  const lowY =
    CHART_DIMENSIONS.height - ((low - min) / range) * CHART_DIMENSIONS.height;
  const openY =
    CHART_DIMENSIONS.height - ((open - min) / range) * CHART_DIMENSIONS.height;
  const closeY =
    CHART_DIMENSIONS.height - ((close - min) / range) * CHART_DIMENSIONS.height;

  return { highY, lowY, openY, closeY };
}

function renderGridLines() {
  return GRID_LINES.map((ratio) => (
    <line
      key={ratio}
      x1="0"
      y1={CHART_DIMENSIONS.height * ratio}
      x2={CHART_DIMENSIONS.width}
      y2={CHART_DIMENSIONS.height * ratio}
      stroke="currentColor"
      strokeWidth="0.5"
      className={COLORS.GRID}
    />
  ));
}

function renderCandle(
  rawBar: any,
  index: number,
  bars: any[],
  priceRange: PriceRange
) {
  let x;
  if (bars.length === 1) {
    x = CHART_DIMENSIONS.width / 2;
  } else {
    x = (index / (bars.length - 1)) * CHART_DIMENSIONS.width;
  }
  const bar = convertToCandleBar(rawBar);
  const isGreen = bar.close >= bar.open;
  const color = isGreen ? COLORS.GREEN : COLORS.RED;

  const { highY, lowY, openY, closeY } = calculateCandlePositions(
    bar,
    priceRange
  );

  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

  return (
    <g key={index}>
      <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1" />
      <rect
        x={x - 2}
        y={bodyTop}
        width="4"
        height={bodyHeight}
        fill={isGreen ? color : "transparent"}
        stroke={color}
        strokeWidth="1"
      />
    </g>
  );
}

function renderPriceLabels(priceRange: PriceRange) {
  return (
    <>
      <div className="absolute left-0 top-0 text-xs text-gray-500 dark:text-gray-400">
        ${formatPrice(priceRange.max)}
      </div>
      <div className="absolute left-0 bottom-0 text-xs text-gray-500 dark:text-gray-400">
        ${formatPrice(priceRange.min)}
      </div>
    </>
  );
}

function CandlestickChart({ data }: { data: CandleData }) {
  if (!data || data.length === 0) {
    return <EmptyState icon="📈" message="No chart data available" />;
  }

  const bars = data.slice(-CANDLES_TO_SHOW);
  const candleBars = bars.map(convertToCandleBar);
  const priceRange = calculatePriceRange(candleBars);

  return (
    <div className="space-y-4">
      <div className="relative h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <svg
          width="100%"
          height="100%"
          viewBox={CHART_DIMENSIONS.viewBox}
          className="overflow-visible"
        >
          {renderGridLines()}
          {bars
            .map((bar, index) => renderCandle(bar, index, bars, priceRange))
            .filter(Boolean)}
        </svg>
        {renderPriceLabels(priceRange)}
      </div>
    </div>
  );
}

function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      {children}
    </div>
  );
}

export default function PriceChart({
  selectedInterval
}: {
  selectedInterval: string;
}) {
  const ticker = useAppState((s) => s.ticker);
  const [chartState, setChartState] = useState<ChartState>(INITIAL_CHART_STATE);

  function updateChartState(updates: Partial<ChartState>) {
    setChartState((prev) => ({ ...prev, ...updates }));
  }

  function resetChartState() {
    setChartState(INITIAL_CHART_STATE);
  }

  async function fetchChartData() {
    if (!ticker) {
      resetChartState();
      return;
    }

    updateChartState({ loading: true, error: null });

    try {
      const startTime = Date.now() - CHART_TIMEFRAME_MS;
      const response = await getPriceHistory(
        ticker,
        selectedInterval,
        startTime
      );

      if (response.success && response.data) {
        updateChartState({
          data: response.data,
          loading: false
        });
      } else {
        throw new Error(response.error || "Failed to fetch chart data");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      updateChartState({
        error: errorMessage,
        loading: false,
        data: null
      });
      console.error("Error fetching chart data:", err);
    }
  }

  function renderChartContent() {
    if (!ticker) {
      return (
        <EmptyState icon="📈" message="Select an asset to view price chart" />
      );
    }

    if (chartState.loading) {
      return <ChartSkeleton />;
    }

    if (chartState.error) {
      return <ErrorState error={chartState.error} />;
    }

    if (!chartState.data) {
      return <EmptyState icon="📈" message="No chart data available" />;
    }

    return <CandlestickChart data={chartState.data} />;
  }

  useEffect(() => {
    fetchChartData();
  }, [ticker, selectedInterval]);

  return <ChartContainer>{renderChartContent()}</ChartContainer>;
}
