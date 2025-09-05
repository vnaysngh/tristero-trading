import { DATE_FORMAT_OPTIONS } from "./constants";

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
