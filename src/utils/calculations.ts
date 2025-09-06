import { TimeframePnlData } from "@/types";
import { ChartDataPoint } from "@/types/charts";

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

export function getCalculations(
  position: any,
  currentPrice: string | undefined
) {
  const size = parseFloat(position.szi || "0");
  const entryPrice = position.entryPx || 0;
  const currentPriceNum = currentPrice ? parseFloat(currentPrice) : 0;

  const isLong = size > 0;
  const isShort = size < 0;
  const pnl = isLong
    ? (currentPriceNum - entryPrice) * size
    : isShort
    ? (entryPrice - currentPriceNum) * Math.abs(size)
    : 0;

  const roe = entryPrice > 0 ? (pnl / (entryPrice * Math.abs(size))) * 100 : 0;

  return {
    size,
    isLong,
    isShort,
    pnl,
    roe,
    pnlFormatted: `$${pnl.toFixed(2)}`,
    roeFormatted: `${roe.toFixed(2)}%`
  };
}
