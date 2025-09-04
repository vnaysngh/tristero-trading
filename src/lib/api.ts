import {
  MarketData,
  PriceData,
  CandleData,
  ApiResponse,
  HyperliquidMetaResponse,
  PortfolioData
} from "@/types/trading";

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
    // Filter out delisted markets and return only active ones
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
    user: "0x32664952e3CE32189b193a4E4A918b460b271D61" // Hardcoded address as requested
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
