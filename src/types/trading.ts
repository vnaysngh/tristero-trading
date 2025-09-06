// Trading interface types for Hyperliquid API and application state

export type Theme = "light" | "dark";

export interface NavItem {
  href: string;
  label: string;
}
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

export interface Interval {
  value: string;
  label: string;
}

export interface HyperliquidMetaResponse {
  universe: MarketData[];
  marginTables: any[];
}

export interface PriceData {
  [coin: string]: string;
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

export type OrderSide = "long" | "short";

export interface FormData {
  coin: string;
  side: OrderSide;
  size: string;
  sizePercentage: number;
}

export interface OrderRequest {
  coin: string;
  side: OrderSide;
  size: number;
  leverage: number;
}

export interface CalculationResult {
  orderValue: number;
  marginRequired: number;
}

export interface AccountValues {
  usdcBalance: string;
  positionSize: string;
}

export interface ValidationResult {
  hasEnoughMargin: boolean;
  hasMinimumMargin: boolean;
  isValidSize: boolean;
  canSubmit: boolean;
}

export const INITIAL_FORM_DATA: FormData = {
  coin: "",
  side: "long",
  size: "",
  sizePercentage: 0
};

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

export interface TradingFormState {
  formData: FormData;
  calculations: CalculationResult;
  accountValues: AccountValues;
  validation: ValidationResult;
  buttonText: string;
}

export type ValidationMessages = {
  readonly PLACING: "Placing Order...";
  readonly NOT_ENOUGH_MARGIN: "Not Enough Margin";
  readonly MIN_MARGIN: "Min Margin $10";
  readonly ENTER_SIZE: "Enter Size";
  readonly PLACE_ORDER: "Place Order";
};

export interface ChartState {
  data: CandleData | null;
  loading: boolean;
  error: string | null;
}

export interface CandleBar {
  open: number;
  high: number;
  low: number;
  close: number;
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
