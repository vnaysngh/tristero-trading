"use client";

import { useState } from "react";
import { PortfolioProps, TimeframeKey } from "@/types";
import {
  processPortfolioData,
  calculateChartBounds,
  generateValuePolylinePoints
} from "@/utils";
import TimeFrameButtons from "./TimeFrameButtons";
import TotalValueChart from "./ValueChart";
import PNLChart from "./PNLChart";
import TimestampLabels from "./TimeStampLabels";

export function PortfolioChart({ portfolio }: PortfolioProps) {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeKey>("day");

  const portfolioArray = Array.isArray(portfolio) ? portfolio : [];
  const selectedData = portfolioArray.find(
    ([period]) => period === selectedTimeframe
  )?.[1];
  const chartData = processPortfolioData(selectedData);
  const { minValue, maxValue, range, maxPnl } = calculateChartBounds(chartData);

  const hasData = chartData.length > 0;
  const firstTimestamp = hasData ? chartData[0].timestamp : 0;
  const lastTimestamp = hasData ? chartData[chartData.length - 1].timestamp : 0;

  const valuePolylinePoints = hasData
    ? generateValuePolylinePoints(chartData, minValue, range)
    : "";
  const midValue = (maxValue + minValue) / 2;

  function renderEmptyState() {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No data available for this timeframe
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Value
          </h3>
          <TimeFrameButtons
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
          />
        </div>
      </div>

      <div className="p-6">
        {hasData ? (
          <div className="space-y-4">
            <TotalValueChart
              valuePolylinePoints={valuePolylinePoints}
              chartData={chartData}
              minValue={minValue}
              maxValue={maxValue}
              range={range}
              midValue={midValue}
            />
            <PNLChart chartData={chartData} maxPnl={maxPnl} />
            <TimestampLabels
              firstTimestamp={firstTimestamp}
              lastTimestamp={lastTimestamp}
              selectedTimeframe={selectedTimeframe}
            />
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
}
