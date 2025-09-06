import { Hyperliquid } from "../../node_modules/hyperliquid/dist/index";

export interface TradingConfig {
  privateKey: string;
  userAddress: string;
  testnet?: boolean;
  vaultAddress?: string;
}

export interface MarketOrderRequest {
  coin: string;
  isBuy: boolean;
  size: number;
  leverage?: number;
}

export interface TradingResult {
  success: boolean;
  data?: any;
  error?: string;
}

class TradingService {
  private sdk: Hyperliquid | null = null;

  async initialize(config: TradingConfig): Promise<void> {
    this.sdk = new Hyperliquid({
      privateKey: config.privateKey,
      testnet: config.testnet || false,
      walletAddress: config.userAddress,
      vaultAddress: config.vaultAddress
    });

    await this.sdk.connect();
  }

  async placeMarketOrder(request: MarketOrderRequest): Promise<TradingResult> {
    if (!this.sdk) {
      throw new Error("Trading service not initialized");
    }

    try {
      const response = await this.sdk.custom.marketOpen(
        request.coin,
        request.isBuy,
        request.size
      );

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error("Error placing market order:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  async closePosition(coin: string): Promise<TradingResult> {
    if (!this.sdk) {
      throw new Error("Trading service not initialized");
    }

    try {
      const response = await this.sdk.custom.marketClose(coin);

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error("Error closing position:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  async updateLeverage(coin: string, leverage: number): Promise<TradingResult> {
    if (!this.sdk) {
      throw new Error("Trading service not initialized");
    }

    try {
      const response = await this.sdk.exchange.updateLeverage(
        coin,
        "isolated",
        leverage
      );

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error("Error updating leverage:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  async getClearinghouseState(userAddress: string): Promise<TradingResult> {
    try {
      const response = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "clearinghouseState",
          user: userAddress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error getting clearinghouse state:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  async getUserFills(userAddress: string): Promise<TradingResult> {
    try {
      const response = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "userFills",
          user: userAddress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error getting user fills:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}

export const tradingService = new TradingService();
