// Trading interface types for Hyperliquid API and application state

export interface MarketData {
  name: string;
  szDecimals: number;
  maxLeverage: number;
  marginTableId: number;
  onlyIsolated?: boolean;
  isDelisted?: boolean;
}

export interface HyperliquidMetaResponse {
  universe: MarketData[];
  marginTables: any[];
}

export interface PriceData {
  [coin: string]: string;
}

export interface CandleBar {
  t: number; // start time
  T: number; // end time
  s: string; // symbol
  i: string; // interval
  o: string; // open
  c: string; // close
  h: string; // high
  l: string; // low
  v: string; // volume
  n: number; // number of trades
}

export type CandleData = CandleBar[];

export interface Position {
  id: string;
  coin: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  timestamp: number;
}

export interface Transaction {
  id: string;
  type: "buy" | "sell";
  coin: string;
  size: number;
  price: number;
  timestamp: number;
  pnl?: number;
}

export interface TradingFormData {
  coin: string;
  side: "long" | "short";
  size: number;
  price?: number; // Optional for market orders
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PortfolioHistory {
  accountValueHistory: [number, string][];
  pnlHistory: [number, string][];
  vlm: string;
}

export type PortfolioData = [string, PortfolioHistory][];
