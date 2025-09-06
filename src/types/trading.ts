// types/trading.ts
// Trading form and order-related types
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

export interface PlaceOrderRequest {
  coin: string;
  side: "long" | "short";
  size: number;
  leverage: number;
}

export interface TradingFormData {
  coin: string;
  side: "long" | "short";
  size: number;
  price?: number; // Optional for market orders
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

export interface TradingFormState {
  formData: FormData;
  calculations: CalculationResult;
  accountValues: AccountValues;
  validation: ValidationResult;
  buttonText: string;
}

export const INITIAL_FORM_DATA: FormData = {
  coin: "",
  side: "long",
  size: "",
  sizePercentage: 0
} as const;

export type ValidationMessages = {
  readonly CONNECT_WALLET: "Connect Wallet";
  readonly PLACING: "Placing Order...";
  readonly NOT_ENOUGH_MARGIN: "Not Enough Margin";
  readonly MIN_MARGIN: "Min Margin $10";
  readonly ENTER_SIZE: "Enter Size";
  readonly PLACE_ORDER: "Place Order";
};

export interface TradingServiceConfig {
  privateKey: string;
  userAddress: string;
  testnet?: boolean;
  vaultAddress?: string;
}
