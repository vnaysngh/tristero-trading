export interface CandleBar {
  open: number;
  high: number;
  low: number;
  close: number;
}

export type CandleData = CandleBar[];

export interface ChartState {
  data: CandleData | null;
  loading: boolean;
  error: string | null;
}

export interface ChartDimensions {
  width: number;
  height: number;
  viewBox: string;
}

export interface PriceRange {
  max: number;
  min: number;
  range: number;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  pnl: number;
}
