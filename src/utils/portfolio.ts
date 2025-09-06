import { ChartDataPoint } from "@/types/charts";

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

export function extractTimeframeData(portfolioArray: any[], period: string) {
  return portfolioArray.find(([p]) => p === period)?.[1];
}

export function getLatestValue(
  data: any,
  field: "accountValueHistory" | "pnlHistory"
): number {
  if (!data?.[field]?.length) return 0;

  const lastEntry = data[field][data[field].length - 1];
  return parseFloat(lastEntry?.[1] || "0");
}
