"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppState } from "@/state/store";
import { useAccountData, usePlaceOrder } from "@/hooks/useMarket";

export function MarketTradingForm() {
  const ticker = useAppState((s) => s.ticker);
  const currentPrice = useAppState((s) => s.prices[ticker]);
  const [formData, setFormData] = useState({
    coin: ticker || "",
    side: "long" as "long" | "short",
    size: "",
    sizePercentage: 0
  });

  // Use React Query hooks
  const {
    accountData,
    loading: loadingBalance,
    error: accountError,
    refetch: refetchAccount
  } = useAccountData("0x32664952e3CE32189b193a4E4A918b460b271D61");

  const {
    placeOrder,
    isPlacing,
    orderError,
    orderSuccess,
    reset: resetOrder
  } = usePlaceOrder();

  useEffect(() => {
    if (ticker && ticker !== formData.coin) {
      setFormData((prev) => ({
        ...prev,
        coin: ticker,
        size: "",
        sizePercentage: 0
      }));
    }
  }, [ticker, formData.coin]);

  const leverage = 2;

  // Derived variables using useMemo
  const orderValue = useMemo(() => {
    if (!ticker || !currentPrice || !formData.size) return 0;
    const size = parseFloat(formData.size);
    if (isNaN(size) || size <= 0) return 0;
    const price = parseFloat(currentPrice.toString());
    return size * price;
  }, [ticker, currentPrice, formData.size]);

  const marginRequired = useMemo(() => {
    return orderValue / leverage;
  }, [orderValue, leverage]);

  const hasEnoughMargin = () => {
    const usdcBalance = parseFloat(getUSDCBalance());
    return marginRequired <= usdcBalance;
  };

  const hasMinimumMargin = () => {
    return marginRequired >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetOrder();

    if (!formData.coin || !formData.size) {
      return;
    }

    const size = parseFloat(formData.size);
    if (isNaN(size) || size <= 0) {
      return;
    }

    if (!hasMinimumMargin()) {
      return;
    }

    const orderRequest = {
      coin: formData.coin,
      side: formData.side,
      size: size,
      leverage: leverage
    };

    placeOrder(orderRequest, {
      onSuccess: () => {
        setFormData((prev) => ({
          ...prev,
          size: "",
          sizePercentage: 0
        }));
      }
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    resetOrder();
  };

  const getUSDCBalance = () => {
    if (!accountData?.marginSummary) return "0.00";
    return parseFloat(
      accountData.crossMarginSummary.accountValue || "0"
    ).toFixed(2);
  };

  const getPositionSize = () => {
    if (!accountData?.assetPositions || !formData.coin) return "0.0000";
    const position = accountData.assetPositions.find(
      (pos: any) => pos.position.coin === formData.coin
    );
    if (!position) return "0.0000";
    return parseFloat(position.position.szi || "0").toFixed(4);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Market Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            onClick={() => handleInputChange("side", "long")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              formData.side === "long"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Buy / Long
          </button>
          <button
            type="button"
            onClick={() => handleInputChange("side", "short")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              formData.side === "short"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Sell / Short
          </button>
          <div className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md cursor-not-allowed opacity-60">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {leverage}x
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Available to Trade
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {loadingBalance ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  `$${getUSDCBalance()}`
                )}
              </span>
              <button
                type="button"
                onClick={() => refetchAccount()}
                disabled={loadingBalance}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {loadingBalance ? "..." : "↻"}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current Position
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {loadingBalance ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${getPositionSize()} ${formData.coin || "ETH"}`
              )}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Size
          </label>
          <div className="flex w-full">
            <input
              type="number"
              id="size"
              value={formData.size}
              onChange={(e) => handleInputChange("size", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-w-0"
              placeholder="Enter size"
              required
            />
            <div className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-24 flex-shrink-0 flex items-center justify-center">
              <span className="text-sm font-medium">
                {formData.coin || "ETH"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Order Value
            </span>
            <span className="text-gray-900 dark:text-white">
              ${orderValue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Margin Required
            </span>
            <span
              className={`${
                (!hasEnoughMargin() || !hasMinimumMargin()) && formData.size
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              ${marginRequired.toFixed(2)}
              {!hasEnoughMargin() && formData.size && (
                <span className="ml-1 text-xs">(Insufficient)</span>
              )}
              {!hasMinimumMargin() && formData.size && hasEnoughMargin() && (
                <span className="ml-1 text-xs">(Min $10)</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Leverage</span>
            <span className="text-gray-900 dark:text-white">{leverage}x</span>
          </div>
        </div>

        {(orderError || accountError) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md flex justify-between items-center">
            <span>{orderError || accountError}</span>
            <button
              onClick={resetOrder}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {orderSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md flex justify-between items-center">
            <span>Order placed successfully!</span>
            <button
              onClick={resetOrder}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              ×
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={
            isPlacing ||
            !hasEnoughMargin() ||
            !hasMinimumMargin() ||
            !formData.size ||
            parseFloat(formData.size.toString()) <= 0
          }
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isPlacing ||
            !hasEnoughMargin() ||
            !hasMinimumMargin() ||
            !formData.size ||
            parseFloat(formData.size.toString()) <= 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          }`}
        >
          {isPlacing
            ? "Placing Order..."
            : !hasEnoughMargin()
            ? "Not Enough Margin"
            : !hasMinimumMargin()
            ? "Min Margin $10"
            : !formData.size || parseFloat(formData.size.toString()) <= 0
            ? "Enter Size"
            : "Place Order"}
        </button>
      </form>
    </div>
  );
}
