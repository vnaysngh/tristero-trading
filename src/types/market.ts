export interface MarketData {
  name: string;
  szDecimals: number;
  maxLeverage: number;
  marginTableId: number;
  onlyIsolated?: boolean;
  isDelisted?: boolean;
}

export interface MarketSelectProps {
  selectedInterval: string;
  setSelectedInterval: (interval: string) => void;
}

export interface HyperliquidMetaResponse {
  universe: MarketData[];
  marginTables: any[];
}

export interface PriceData {
  [coin: string]: string;
}
