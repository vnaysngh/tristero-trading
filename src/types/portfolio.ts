export interface PortfolioDataPoint {
  timestamp: number;
  value: string;
}

export interface PortfolioPeriod {
  accountValueHistory: PortfolioDataPoint[];
  pnlHistory: PortfolioDataPoint[];
  vlm: string;
}

export interface PortfolioData extends Array<[string, PortfolioPeriod]> {}

export interface PortfolioProps {
  portfolio: PortfolioData;
}

export interface PortfolioChartProps {
  portfolio: PortfolioData;
}

export interface PortfolioStats {
  currentValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
  volume: number;
  period: string;
}

export type TimeframeKey = "day" | "week" | "month" | "allTime";

export interface TimeframeConfig {
  key: TimeframeKey;
  label: string;
}

export interface ProcessedTimeframeData {
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
  volume: number;
  dataPoints: number;
}

export interface TimeframeRow extends TimeframeConfig {
  data: ProcessedTimeframeData;
}

export interface TimeframePnlData {
  pnl: number;
  percentage: number;
  changeType: "positive" | "negative";
}

export interface Stat {
  label: string;
  value: string;
  change: string | null;
  changeType: "positive" | "negative" | null;
}
