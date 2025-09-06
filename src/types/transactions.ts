export interface Transaction {
  id: string;
  type: "buy" | "sell";
  coin: string;
  size: number;
  price: number;
  timestamp: number;
  pnl?: number;
}

export interface RawFill {
  time: string;
  coin: string;
  dir: string;
  px: string;
  sz: string;
  fee: string;
  closedPnl: string;
  hash: string;
  tid: number;
}

export interface ProcessedPosition {
  time: string;
  coin: string;
  direction: string;
  price: string;
  size: string;
  tradeValue: string;
  fee: string;
  closedPnl: string;
  closedPnlValue: number;
  hash: string;
  tid: number;
}

export type TradeHistoryState = ProcessedPosition[];
