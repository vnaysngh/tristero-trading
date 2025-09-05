import React from "react";
import {
  MarketData,
  PriceData,
  CandleData,
  ApiResponse,
  HyperliquidMetaResponse,
  PortfolioData
} from "@/types/trading";
import { tradingService } from "./trading-service";

const API_BASE_URL = "https://api.hyperliquid.xyz/info";

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

export function formatPrice(
  price: string | number,
  decimals: number = 2
): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return num.toFixed(decimals);
}

export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  size: number,
  side: "long" | "short"
): { pnl: number; pnlPercentage: number } {
  const priceDiff =
    side === "long" ? currentPrice - entryPrice : entryPrice - currentPrice;

  const pnl = priceDiff * size;
  const pnlPercentage = (pnl / (entryPrice * size)) * 100;

  return { pnl, pnlPercentage };
}

export async function getPortfolioData(): Promise<ApiResponse<PortfolioData>> {
  const body = {
    type: "portfolio",
    user: "0x32664952e3CE32189b193a4E4A918b460b271D61"
  };

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
    console.error("Portfolio API request failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch portfolio data"
    };
  }
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

export async function initializeTradingService(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const config: TradingServiceConfig = {
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
      userAddress: "0x32664952e3CE32189b193a4E4A918b460b271D61",
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

/* export async function handleClosePosition(
  coin: string,
  isTradingServiceInitialized: boolean,
  setCloseError: (error: string | null) => void,
  setCloseSuccess: (success: string | null) => void,
  setClosingPositions: React.Dispatch<React.SetStateAction<Set<string>>>,
  setIsTradingServiceInitialized: (initialized: boolean) => void,
  refetchPositions: () => Promise<any>
): Promise<ClosePositionResult> {
  setCloseError(null);
  setCloseSuccess(null);
  setClosingPositions((prev) => new Set(prev).add(coin));

  try {
    let initialized = isTradingServiceInitialized;

    if (!initialized) {
      const initResult = await initializeTradingService();
      if (!initResult.success) {
        setCloseError(
          initResult.error || "Failed to initialize trading service"
        );
        return { success: false, error: initResult.error };
      }
      initialized = true;
      setIsTradingServiceInitialized(true);
    }

    const result = await tradingService.closePosition(coin);

    if (result.success) {
      setCloseSuccess(`Position ${coin} closed successfully!`);
      await refetchPositions();
      return {
        success: true,
        message: `Position ${coin} closed successfully!`
      };
    } else {
      const errorMsg = result.error || `Failed to close position ${coin}`;
      setCloseError(errorMsg);
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    let errorMessage: string;

    if (err instanceof Error && err.message.includes("not initialized")) {
      errorMessage =
        "Trading service not initialized. Please configure your private key in environment variables.";
    } else {
      errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
    }

    setCloseError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setClosingPositions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(coin);
      return newSet;
    });
  }
} */
