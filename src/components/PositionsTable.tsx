"use client";

import { useState, useEffect } from "react";
import { usePriceData } from "@/hooks/useMarketQueries";
import { formatPrice } from "@/lib/api";
import { tradingService } from "@/lib/trading-service";

interface Position {
  coin: string;
  originalCoin: string;
  size: string;
  positionValue: string;
  entryPrice: string;
  markPrice: string;
  pnl: string;
  roe: string;
  liqPrice: string;
  margin: string;
}

export function PositionsTable() {
  const { prices } = usePriceData();
  const [markPrice, setMarkPrice] = useState("4,460.2");
  const [closingPositions, setClosingPositions] = useState<Set<string>>(
    new Set()
  );
  const [closeError, setCloseError] = useState<string | null>(null);
  const [closeSuccess, setCloseSuccess] = useState<string | null>(null);
  const [realPositions, setRealPositions] = useState<any[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [isTradingServiceInitialized, setIsTradingServiceInitialized] =
    useState(false);
  const [priceUpdateTrigger, setPriceUpdateTrigger] = useState(0);

  useEffect(() => {
    if (prices && prices.ETH) {
      setMarkPrice(formatPrice(prices.ETH));
    }
  }, [prices]);

  useEffect(() => {
    if (realPositions.length > 0 && prices) {
      setPriceUpdateTrigger((prev) => prev + 1);
    }
  }, [prices, realPositions]);

  const fetchRealPositions = async () => {
    setLoadingPositions(true);
    try {
      const result = await tradingService.getClearinghouseState(
        "0x32664952e3CE32189b193a4E4A918b460b271D61"
      );
      if (result.success && result.data?.assetPositions) {
        // Filter out positions with zero size
        const activePositions = result.data.assetPositions.filter(
          (pos: any) => parseFloat(pos.position.szi || "0") !== 0
        );
        setRealPositions(activePositions);
      }
    } catch (err) {
      console.error("Error fetching real positions:", err);
    } finally {
      setLoadingPositions(false);
    }
  };

  const initializeTradingService = async () => {
    try {
      const config = {
        privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
        userAddress: "0x32664952e3CE32189b193a4E4A918b460b271D61",
        testnet: false,
        vaultAddress: undefined as string | undefined
      };

      if (!config.privateKey) {
        setCloseError(
          "Please configure your private key in environment variables"
        );
        return false;
      }

      await tradingService.initialize(config);
      setIsTradingServiceInitialized(true);
      setCloseError(null);
      return true;
    } catch (err) {
      setCloseError(
        err instanceof Error
          ? err.message
          : "Failed to initialize trading service"
      );
      return false;
    }
  };

  useEffect(() => {
    fetchRealPositions();
  }, []);

  const handleClosePosition = async (coin: string) => {
    setCloseError(null);
    setCloseSuccess(null);
    setClosingPositions((prev) => new Set(prev).add(coin));

    try {
      if (!isTradingServiceInitialized) {
        const initialized = await initializeTradingService();
        if (!initialized) {
          return;
        }
      }

      const result = await tradingService.closePosition(coin);

      if (result.success) {
        setCloseSuccess(`Position ${coin} closed successfully!`);
        await fetchRealPositions();
      } else {
        setCloseError(result.error || `Failed to close position ${coin}`);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("not initialized")) {
        setCloseError(
          "Trading service not initialized. Please configure your private key in environment variables."
        );
      } else {
        setCloseError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      }
    } finally {
      setClosingPositions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(coin);
        return newSet;
      });
    }
  };

  const generateRealPositions = (): Position[] => {
    if (loadingPositions || !realPositions.length) return [];

    const _ = priceUpdateTrigger;

    return realPositions.map((pos: any) => {
      const coin = pos.position.coin;
      const size = parseFloat(pos.position.szi || "0");
      const entryPx = parseFloat(pos.position.entryPx || "0");
      const currentPrice = parseFloat(
        prices[coin]?.toString() || markPrice.replace(/,/g, "")
      );

      const leverage = pos.position.leverage?.value || 1;
      const marginUsed = parseFloat(pos.position.marginUsed || "0");
      const unrealizedPnl = parseFloat(pos.position.unrealizedPnl || "0");
      const positionValue = parseFloat(pos.position.positionValue || "0");
      const returnOnEquity = parseFloat(pos.position.returnOnEquity || "0");
      const liquidationPx = parseFloat(pos.position.liquidationPx || "0");

      const priceDifference =
        size >= 0 ? currentPrice - entryPx : entryPx - currentPrice;
      const pnl = Math.abs(size) * priceDifference;
      const roe = marginUsed > 0 ? (pnl / marginUsed) * 100 : 0; // ROE = PnL / margin_used * 100

      return {
        coin: `${coin} ${leverage}x`,
        originalCoin: `${coin}-PERP`,
        size: `${Math.abs(size).toFixed(4)} ${coin}`,
        positionValue: `$${formatPrice(positionValue.toString())}`,
        entryPrice: formatPrice(entryPx.toString()),
        markPrice: formatPrice(currentPrice.toString()),
        pnl:
          pnl >= 0
            ? `+$${formatPrice(pnl.toString())}`
            : `-$${formatPrice(Math.abs(pnl).toString())}`,
        roe:
          roe >= 0
            ? `+${formatPrice(roe.toString())}%`
            : `${formatPrice(roe.toString())}%`,
        liqPrice:
          liquidationPx > 0 ? formatPrice(liquidationPx.toString()) : "N/A",
        margin: `$${formatPrice(marginUsed.toString())} (Isolated)`
      };
    });
  };

  const positions = generateRealPositions();
  const isLoading = loadingPositions;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading positions...
          </p>
        </div>
      </div>
    );
  }

  /*  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            Failed to load portfolio data
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  } */

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {closeError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-3">
          {closeError}
        </div>
      )}
      {closeSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-6 py-3">
          {closeSuccess}
        </div>
      )}

      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Open Positions
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchRealPositions}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Coin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Position Value</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entry Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mark Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="underline">PNL</span>
                  <span className="underline">(ROE %)</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Liq. Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span className="underline">Margin</span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Close All
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">No open positions yet</p>
                    <p className="text-sm mt-1">
                      Start trading to see your positions here
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              positions.map((position, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {position.coin}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.positionValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.entryPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.markPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm">
                        <div
                          className={`font-semibold ${
                            position.pnl.startsWith("+")
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {position.pnl} ({position.roe})
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.liqPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {position.margin}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleClosePosition(position.originalCoin)
                        }
                        disabled={closingPositions.has(position.coin)}
                        className={`text-sm font-medium transition-colors cursor-pointer ${
                          closingPositions.has(position.coin)
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        }`}
                      >
                        {closingPositions.has(position.coin)
                          ? "Closing..."
                          : "Market"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
