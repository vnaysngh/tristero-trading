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

export interface TradingServiceConfig {
  privateKey: string;
  userAddress: string;
  testnet?: boolean;
  vaultAddress?: string;
}

export interface ClosePositionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface PlaceOrderRequest {
  coin: string;
  side: "long" | "short";
  size: number;
  leverage: number;
}
