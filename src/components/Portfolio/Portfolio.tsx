"use client";

import { useAppState } from "@/state/store";
import { usePortfolio } from "@/hooks/useMarket";
import LoadingState from "@/components/common/LoadingState";
import { PortfolioChart } from "./PortfolioChart";
import { PortfolioStats } from "./PortfolioStats";
import { PortfolioTable } from "./PortfolioTable";

export default function PortfolioPage() {
  const walletAddress = useAppState((s) => s.walletAddress);
  const { portfolio, loading, refetch } = usePortfolio(walletAddress);

  if (loading) {
    return <LoadingState message="Loading portfolio data..." />;
  }

  if (!portfolio || !walletAddress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Portfolio Data
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {!walletAddress
              ? "Please connect your wallet to view portfolio data"
              : "No portfolio data available. Start trading to see your portfolio performance."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Overview
          </h2>
          <button
            onClick={() => refetch()}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="p-6">
          <PortfolioStats portfolio={portfolio} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioChart portfolio={portfolio} />
        <PortfolioTable portfolio={portfolio} />
      </div>
    </div>
  );
}
