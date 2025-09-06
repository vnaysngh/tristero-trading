"use client";

import { PortfolioProps, Stat } from "@/types/trading";
import {
  calculatePnlData,
  extractTimeframeData,
  getChangeTypeClass,
  getLatestValue,
  getPnLData
} from "@/utils/portfolio";

export function PortfolioStats({ portfolio }: PortfolioProps) {
  const portfolioArray = Array.isArray(portfolio) ? portfolio : [];

  const timeframeData = {
    day: extractTimeframeData(portfolioArray, "day"),
    week: extractTimeframeData(portfolioArray, "week"),
    month: extractTimeframeData(portfolioArray, "month"),
    allTime: extractTimeframeData(portfolioArray, "allTime")
  };

  const currentValue = getLatestValue(timeframeData.day, "accountValueHistory");

  const pnlData = {
    day: calculatePnlData(
      getLatestValue(timeframeData.day, "pnlHistory"),
      currentValue
    ),
    week: calculatePnlData(
      getLatestValue(timeframeData.week, "pnlHistory"),
      currentValue
    ),
    month: calculatePnlData(
      getLatestValue(timeframeData.month, "pnlHistory"),
      currentValue
    ),
    allTime: calculatePnlData(
      getLatestValue(timeframeData.allTime, "pnlHistory"),
      currentValue
    )
  };

  const dayVolume = parseFloat(timeframeData.day?.vlm || "0");

  const stats: Stat[] = getPnLData(pnlData, dayVolume, currentValue);

  function renderStatCard(stat: Stat, index: number) {
    return (
      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {stat.label}
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {stat.value}
        </div>
        {stat.change && (
          <div className={`text-sm ${getChangeTypeClass(stat.changeType)}`}>
            {stat.change}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map(renderStatCard)}
    </div>
  );
}
