import {
  MarketData,
  PriceData,
  CandleData,
  ApiResponse,
  HyperliquidMetaResponse,
  TradingServiceConfig,
  PlaceOrderRequest
} from "@/types/trading";
import { tradingService } from "./trading-service";
import { API_BASE_URL } from "@/constants";

async function makeRequest<T>(body: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getAllPrices(): Promise<ApiResponse<PriceData>> {
  return makeRequest<PriceData>({ type: "allMids" });
}

export async function getMarketData(): Promise<ApiResponse<MarketData[]>> {
  const response = await makeRequest<HyperliquidMetaResponse>({
    type: "meta"
  });
  if (response.success && response.data) {
    const activeMarkets = response.data.universe.filter(
      (market) => !market.isDelisted
    );
    return { success: true, data: activeMarkets };
  }
  return {
    success: false,
    error: response.error || "Failed to fetch market data"
  };
}

export async function getPriceHistory(
  coin: string,
  interval: string = "1h",
  startTime: number
): Promise<ApiResponse<CandleData>> {
  const req = { coin, interval, startTime };
  return makeRequest<CandleData>({ type: "candleSnapshot", req });
}

export async function initializeTradingService(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const config: TradingServiceConfig = {
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
      userAddress: "",
      testnet: false,
      vaultAddress: undefined as string | undefined
    };

    if (!config.privateKey) {
      return {
        success: false,
        error: "Please configure your private key in environment variables"
      };
    }

    await tradingService.initialize(config);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to initialize trading service"
    };
  }
}

export async function getAccountData(
  userAddress: string
): Promise<ApiResponse<any>> {
  try {
    const result = await tradingService.getClearinghouseState(userAddress);

    if (result.success) {
      return { success: true, data: result.data };
    }

    return {
      success: false,
      error: result.error || "Failed to fetch account data"
    };
  } catch (error) {
    console.error("Error fetching account data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch account data"
    };
  }
}

export async function placeOrder(
  request: PlaceOrderRequest
): Promise<ApiResponse<any>> {
  try {
    await tradingService.updateLeverage(
      `${request.coin}-PERP`,
      request.leverage
    );

    const orderRequest = {
      coin: request.coin,
      isBuy: request.side === "long",
      size: request.size,
      leverage: request.leverage
    };

    const result = await tradingService.placeMarketOrder(orderRequest);

    if (result.success) {
      return { success: true, data: result.data };
    }

    return {
      success: false,
      error: result.error || "Failed to place order"
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to place order"
    };
  }
}

export async function getPortfolio(
  userAddress: string
): Promise<ApiResponse<any>> {
  try {
    const result = await tradingService.getPortfolio(userAddress);

    if (result.success) {
      return { success: true, data: result.data };
    }

    return {
      success: false,
      error: result.error || "Failed to fetch portfolio data"
    };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch portfolio data"
    };
  }
}
