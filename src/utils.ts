export function formatPrice(
  price: string | number,
  decimals: number = 2
): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return num.toFixed(decimals);
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
