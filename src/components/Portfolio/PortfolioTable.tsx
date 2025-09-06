"use client";

import {
  PortfolioProps,
  ProcessedTimeframeData,
  TimeframeKey,
  TimeframeRow
} from "@/types/trading";
import TableHeader from "@/components/common/TableHeader";
import { TABLE_HEADERS, TIMEFRAME_CONFIG } from "@/constants";
import { formatCurrency, formatPercentage } from "@/utils/portfolio";
import { getPnlColorClass } from "@/utils";

function findTimeframeData(portfolioArray: any[], timeframeKey: TimeframeKey) {
  return portfolioArray.find(([period]) => period === timeframeKey)?.[1];
}

function getLatestHistoryValue(history: any[] | undefined): number {
  if (!history?.length) return 0;
  return parseFloat(history[history.length - 1]?.[1] || "0");
}

function calculatePnlPercentage(pnl: number, currentValue: number): number {
  return currentValue > 0 ? (pnl / (currentValue - pnl)) * 100 : 0;
}

function processTimeframeData(data: any): ProcessedTimeframeData {
  const currentValue = getLatestHistoryValue(data?.accountValueHistory);
  const pnl = getLatestHistoryValue(data?.pnlHistory);
  const pnlPercentage = calculatePnlPercentage(pnl, currentValue);
  const volume = parseFloat(data?.vlm || "0");
  const dataPoints = data?.accountValueHistory?.length || 0;

  return {
    currentValue,
    pnl,
    pnlPercentage,
    volume,
    dataPoints
  };
}

export function PortfolioTable({ portfolio }: PortfolioProps) {
  const portfolioArray = Array.isArray(portfolio) ? portfolio : [];

  const timeframeRows: TimeframeRow[] = TIMEFRAME_CONFIG.map((config) => {
    const rawData = findTimeframeData(portfolioArray, config.key);
    const processedData = processTimeframeData(rawData);

    return {
      ...config,
      data: processedData
    };
  });

  function renderTableRow(timeframe: TimeframeRow) {
    const { key, label, data } = timeframe;
    const pnlColorClass = getPnlColorClass(data.pnl);
    const pnlPercentageColorClass = getPnlColorClass(data.pnlPercentage);

    return (
      <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {formatCurrency(data.currentValue)}
        </td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${pnlColorClass}`}>
          {formatCurrency(data.pnl)}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${pnlPercentageColorClass}`}
        >
          {formatPercentage(data.pnlPercentage)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {formatCurrency(data.volume)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {data.dataPoints}
        </td>
      </tr>
    );
  }

  function renderTableHeader() {
    return (
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Summary
        </h3>
      </div>
    );
  }

  function renderTableBody() {
    return (
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {timeframeRows.map(renderTableRow)}
      </tbody>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {renderTableHeader()}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader headers={[...TABLE_HEADERS]} />
          {renderTableBody()}
        </table>
      </div>
    </div>
  );
}
