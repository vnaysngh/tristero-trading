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

export interface PositionTable {
  coin: string;
  szi?: string;
  positionValue?: string;
  entryPx: number;
  liquidationPx?: string;
  marginUsed?: string;
  leverage?: {
    value: number;
  };
}

export interface PositionsTableProps {
  position: PositionTable;
  closingPositions: Set<string>;
  handleClosePosition: (coin: string) => void;
}

export interface PositionCalculation {
  size: number;
  isLong: boolean;
  isShort: boolean;
  pnl: number;
  roe: number;
  pnlFormatted: string;
  roeFormatted: string;
}

export interface ClosePositionResult {
  success: boolean;
  error?: string;
  message?: string;
}
