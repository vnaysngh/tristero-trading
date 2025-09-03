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
  price?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
