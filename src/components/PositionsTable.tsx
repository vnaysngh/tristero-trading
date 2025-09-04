"use client";

import { useState, useEffect } from "react";
import { usePortfolioData, usePriceData } from "@/hooks/useMarket";
import { formatPrice } from "@/lib/api";

interface Position {
  coin: string;
  size: string;
  positionValue: string;
  entryPrice: string;
  markPrice: string;
  pnl: string;
  roe: string;
  liqPrice: string;
  margin: string;
}

function generatePositionFromPortfolio(
  portfolio: any,
  currentMarkPrice: string
): Position[] {
  if (!portfolio || !Array.isArray(portfolio)) {
    return [];
  }

  // Find the "day" data from the array structure
  const dayData = portfolio.find((item: any) => item[0] === "day");

  if (!dayData || !dayData[1]) {
    return [];
  }

  const dayPortfolio = dayData[1];
  const latestAccountValue =
    dayPortfolio.accountValueHistory[
      dayPortfolio.accountValueHistory.length - 1
    ];
  const latestPnL = dayPortfolio.pnlHistory[dayPortfolio.pnlHistory.length - 1];

  if (!latestAccountValue || !latestPnL) return [];

  const accountValue = parseFloat(latestAccountValue[1]);
  const pnl = parseFloat(latestPnL[1]);
  const pnlPercentage =
    accountValue > 0 ? (pnl / (accountValue - pnl)) * 100 : 0;

  const leverage = 3;
  const positionValue = accountValue * leverage;
  const margin = accountValue;

  const position: Position = {
    coin: "ETH 3x",
    size: "0.0067 ETH",
    positionValue: `$${formatPrice(positionValue.toString())}`,
    entryPrice: "4,459.1",
    markPrice: currentMarkPrice,
    pnl:
      pnl >= 0
        ? `+$${formatPrice(pnl.toString())}`
        : `-$${formatPrice(Math.abs(pnl).toString())}`,
    roe:
      pnlPercentage >= 0
        ? `+${formatPrice(pnlPercentage.toString())}%`
        : `${formatPrice(pnlPercentage.toString())}%`,
    liqPrice: "3,035.4",
    margin: `$${formatPrice(margin.toString())} (Isolated)`
  };

  return [position];
}

export function PositionsTable() {
  const { portfolio, loading, error } = usePortfolioData();
  const { prices } = usePriceData();
  const [markPrice, setMarkPrice] = useState("4,460.2");

  useEffect(() => {
    if (prices && prices.ETH) {
      setMarkPrice(formatPrice(prices.ETH));
    }
  }, [prices]);

  const positions = generatePositionFromPortfolio(portfolio, markPrice);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading portfolio data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
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
                      <svg
                        className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors">
                        Market
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
