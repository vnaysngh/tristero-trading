import { TimeframeKey } from "@/types";

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatPrice(
  price: string | number,
  decimals: number = 2
): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return num.toFixed(decimals);
}

export function formatTradeTime(timestamp: string): string {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
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
