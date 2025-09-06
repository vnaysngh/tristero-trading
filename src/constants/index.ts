import {
  ChartDimensions,
  ChartState,
  Interval,
  NavItem,
  Theme,
  ValidationMessages
} from "@/types/trading";

export const DEFAULT_THEME: Theme = "dark";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Markets" },
  { href: "/positions", label: "Positions" },
  { href: "/trades", label: "Trade History" }
];

export const COLORS = {
  GREEN: "#10b981",
  RED: "#ef4444",
  GRID: "text-gray-300 dark:text-gray-600"
} as const;

export const API_BASE_URL = "https://api.hyperliquid.xyz/info";

export const leverage = 2;

export const MIN_MARGIN_REQUIRED = 10;

export const CANDLES_TO_SHOW = 50;
export const GRID_LINES = [0, 0.25, 0.5, 0.75, 1];
export const CHART_TIMEFRAME_MS = 24 * 60 * 60 * 1000; // 24 hours

export const INITIAL_CHART_STATE: ChartState = {
  data: null,
  loading: false,
  error: null
};

export const CHART_DIMENSIONS: ChartDimensions = {
  width: 800,
  height: 200,
  viewBox: "0 0 800 200"
};

export const VALIDATION_MESSAGES: ValidationMessages = {
  CONNECT_WALLET: "Connect Wallet",
  PLACING: "Placing Order...",
  NOT_ENOUGH_MARGIN: "Not Enough Margin",
  MIN_MARGIN: "Min Margin $10",
  ENTER_SIZE: "Enter Size",
  PLACE_ORDER: "Place Order"
} as const;

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
};

export const INTERVALS: Interval[] = [
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" }
];
