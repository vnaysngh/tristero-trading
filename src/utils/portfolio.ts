import {
  ChartDataPoint,
  TimeframeKey,
  TimeframePnlData
} from "@/types/trading";

export function processPortfolioData(data: any): ChartDataPoint[] {
  if (!data?.accountValueHistory?.length || !data?.pnlHistory?.length) {
    return [];
  }

  return data.accountValueHistory.map((point: any, index: number) => ({
    timestamp: point[0],
    value: parseFloat(point[1]),
    pnl: parseFloat(data.pnlHistory[index]?.[1] || "0")
  }));
}

export function calculateChartBounds(data: ChartDataPoint[]) {
  if (data.length === 0) {
    return { minValue: 0, maxValue: 0, range: 0, maxPnl: 0 };
  }

  const values = data.map((d) => d.value);
  const pnlValues = data.map((d) => Math.abs(d.pnl));

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const maxPnl = Math.max(...pnlValues);

  return { minValue, maxValue, range, maxPnl };
}

export function formatTimestampByTimeframe(
  timestamp: number,
  timeframe: TimeframeKey
): string {
  const date = new Date(timestamp);

  switch (timeframe) {
    case "day":
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    case "week":
    case "month":
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    default:
      return date.toLocaleDateString([], { month: "short", year: "2-digit" });
  }
}

export function getValueYPosition(
  value: number,
  minValue: number,
  range: number
): number {
  if (range === 0) return 50;
  return 100 - ((value - minValue) / range) * 80;
}

export function getPnlYPosition(pnl: number, maxPnl: number): number {
  if (maxPnl === 0) return 50;
  return 50 - (pnl / maxPnl) * 40;
}

export function generateValuePolylinePoints(
  data: ChartDataPoint[],
  minValue: number,
  range: number
): string {
  return data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 380 + 10;
      const y = getValueYPosition(point.value, minValue, range);
      return `${x},${y}`;
    })
    .join(" ");
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function extractTimeframeData(portfolioArray: any[], period: string) {
  return portfolioArray.find(([p]) => p === period)?.[1];
}

export function getPnlColorClass(value: number): string {
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
}

export function getLatestValue(
  data: any,
  field: "accountValueHistory" | "pnlHistory"
): number {
  if (!data?.[field]?.length) return 0;

  const lastEntry = data[field][data[field].length - 1];
  return parseFloat(lastEntry?.[1] || "0");
}

export function calculatePnlData(
  pnl: number,
  currentValue: number
): TimeframePnlData {
  const percentage = currentValue > 0 ? (pnl / (currentValue - pnl)) * 100 : 0;

  return {
    pnl,
    percentage,
    changeType: pnl >= 0 ? "positive" : "negative"
  };
}

export function getChangeTypeClass(
  changeType: "positive" | "negative" | null
): string {
  switch (changeType) {
    case "positive":
      return "text-green-600 dark:text-green-400";
    case "negative":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-500 dark:text-gray-400";
  }
}

export const getPnLData = (
  pnlData: any,
  dayVolume: number,
  currentValue: number
) => [
  {
    label: "Current Value",
    value: formatCurrency(currentValue),
    change: null,
    changeType: null
  },
  {
    label: "24h P&L",
    value: formatCurrency(pnlData.day.pnl),
    change: formatPercentage(pnlData.day.percentage),
    changeType: pnlData.day.changeType
  },
  {
    label: "7d P&L",
    value: formatCurrency(pnlData.week.pnl),
    change: formatPercentage(pnlData.week.percentage),
    changeType: pnlData.week.changeType
  },
  {
    label: "30d P&L",
    value: formatCurrency(pnlData.month.pnl),
    change: formatPercentage(pnlData.month.percentage),
    changeType: pnlData.month.changeType
  },
  {
    label: "All Time P&L",
    value: formatCurrency(pnlData.allTime.pnl),
    change: formatPercentage(pnlData.allTime.percentage),
    changeType: pnlData.allTime.changeType
  },
  {
    label: "Volume (24h)",
    value: formatCurrency(dayVolume),
    change: null,
    changeType: null
  }
];
