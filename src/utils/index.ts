import { DATE_FORMAT_OPTIONS } from "@/constants";
import { PositionCalculation, PositionTable } from "@/types/trading";

export function formatPrice(
  price: string | number,
  decimals: number = 2
): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return num.toFixed(decimals);
}

export function formatTradeTime(timeString: string): string {
  const time = new Date(timeString);
  return time.toLocaleString("en-US", DATE_FORMAT_OPTIONS).replace(",", " -");
}

export function getDirectionColorClass(direction: string): string {
  return direction.includes("Close")
    ? "text-red-500 dark:text-red-400"
    : "text-green-500 dark:text-green-400";
}

export function getPnlColorClass(pnlValue: number): string {
  if (pnlValue > 0) return "text-green-500 dark:text-green-400";
  if (pnlValue < 0) return "text-red-500 dark:text-red-400";
  return "text-gray-500 dark:text-gray-400";
}

export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  size: number,
  side: "long" | "short"
): { pnl: number; pnlPercentage: number } {
  const priceDiff =
    side === "long" ? currentPrice - entryPrice : entryPrice - currentPrice;

  const pnl = priceDiff * size;
  const pnlPercentage = (pnl / (entryPrice * size)) * 100;

  return { pnl, pnlPercentage };
}

export const getCalculations = (
  position: PositionTable,
  currentPrice: string
) => {
  const size = parseFloat(position.szi || "0");
  const currentPriceNum = parseFloat(currentPrice);
  const entryPrice = position.entryPx;
  const marginUsed = parseFloat(position.marginUsed || "0");

  const isLong = size > 0;
  const isShort = size < 0;

  const priceDifference = isLong
    ? currentPriceNum - entryPrice
    : entryPrice - currentPriceNum;

  const pnl = Math.abs(size) * priceDifference;
  const roe = marginUsed > 0 ? (pnl / marginUsed) * 100 : 0;

  return {
    size,
    isLong,
    isShort,
    pnl,
    roe,
    pnlFormatted:
      pnl >= 0
        ? `+$${formatPrice(pnl.toString())}`
        : `-$${formatPrice(Math.abs(pnl).toString())}`,
    roeFormatted:
      roe >= 0
        ? `+${formatPrice(roe.toString())}%`
        : `${formatPrice(roe.toString())}%`
  };
};

export const getStyleClasses = (calculations: PositionCalculation) => ({
  positionIndicator: calculations.isLong
    ? "bg-green-500"
    : calculations.isShort
    ? "bg-red-500"
    : "bg-gray-400",

  positionBadge: calculations.isLong
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : calculations.isShort
    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",

  pnlColor:
    calculations.pnl > 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400"
});
