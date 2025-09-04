"use client";

import { useState, useEffect } from "react";
import { tradingService } from "@/lib/trading-service";
import { formatPrice } from "@/lib/api";

export function TradeHistory() {
  const [closedPositions, setClosedPositions] = useState<any[]>([]);
  const [loadingClosedPositions, setLoadingClosedPositions] = useState(false);
  const [isTradingServiceInitialized, setIsTradingServiceInitialized] =
    useState(false);

  const initializeTradingService = async () => {
    try {
      const config = {
        privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
        userAddress: "0x32664952e3CE32189b193a4E4A918b460b271D61",
        testnet: false,
        vaultAddress: undefined as string | undefined
      };

      if (!config.privateKey) {
        console.error(
          "Please configure your private key in environment variables"
        );
        return false;
      }

      await tradingService.initialize(config);
      setIsTradingServiceInitialized(true);
      return true;
    } catch (err) {
      console.error("Failed to initialize trading service:", err);
      return false;
    }
  };

  const fetchClosedPositions = async () => {
    if (!isTradingServiceInitialized) {
      const initialized = await initializeTradingService();
      if (!initialized) {
        return;
      }
    }

    setLoadingClosedPositions(true);
    try {
      const result = await tradingService.getUserFills(
        "0x32664952e3CE32189b193a4E4A918b460b271D61"
      );
      if (result.success) {
        setClosedPositions(result.data || []);
      } else {
        console.error("Failed to fetch trade history:", result.error);
        setClosedPositions([]);
      }
    } catch (err) {
      console.error("Error fetching trade history:", err);
      setClosedPositions([]);
    } finally {
      setLoadingClosedPositions(false);
    }
  };

  const generateClosedPositions = (): any[] => {
    if (loadingClosedPositions || !closedPositions.length) return [];

    return closedPositions.map((fill: any) => {
      const time = new Date(fill.time);
      const formattedTime = time
        .toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
        .replace(",", " -");

      const price = parseFloat(fill.px);
      const size = parseFloat(fill.sz);
      const tradeValue = price * size;
      const fee = parseFloat(fill.fee);
      const closedPnl = parseFloat(fill.closedPnl);
      console.log(closedPnl);

      return {
        time: formattedTime,
        coin: fill.coin,
        direction: fill.dir,
        price: formatPrice(price),
        size: `${size.toFixed(4)} ${fill.coin}`,
        tradeValue: `$${formatPrice(tradeValue)} USDC`,
        fee: `$${formatPrice(fee.toString())} USDC`,
        closedPnl: `${closedPnl} USDC`,
        closedPnlValue: closedPnl,
        hash: fill.hash
      };
    });
  };

  useEffect(() => {
    fetchClosedPositions();
  }, []);

  const positions = generateClosedPositions();
  const isLoading = loadingClosedPositions;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading trade history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Trade History
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchClosedPositions}
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
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Coin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Direction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trade Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Closed PNL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
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
                    <p className="text-lg font-medium">No trade history yet</p>
                    <p className="text-sm mt-1">
                      Trade history will appear here after you make trades
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <span>{position.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.coin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        position.direction.includes("Close")
                          ? "text-red-500 dark:text-red-400"
                          : "text-green-500 dark:text-green-400"
                      }`}
                    >
                      {position.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.tradeValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {position.fee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {position.closedPnl !== "N/A" ? (
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-medium ${
                            position.closedPnlValue > 0
                              ? "text-green-500 dark:text-green-400"
                              : position.closedPnlValue < 0
                              ? "text-red-500 dark:text-red-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {position.closedPnl}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    )}
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
