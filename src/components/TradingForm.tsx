"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useAppState } from "@/state/store";
import { useAccountData, usePlaceOrder } from "@/hooks/useMarket";
import { leverage, USER_ADDRESS } from "@/constants";
import SideButton from "./SideButton";
import LeverageDisplay from "./LeverageDisplay";
import StatusMessage from "./StatusMessage";

export default function MarketTradingForm() {
  const ticker = useAppState((s) => s.ticker);
  const currentPrice = useAppState((s) => s.prices[ticker]);

  const [formData, setFormData] = useState({
    coin: ticker || "",
    side: "long" as "long" | "short",
    size: "",
    sizePercentage: 0
  });

  const {
    accountData,
    loading: loadingBalance,
    error: accountError,
    refetch: refetchAccount
  } = useAccountData(USER_ADDRESS);

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

  const handleInputChange = useCallback(
    (field: string, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      resetOrder();
    },
    [resetOrder]
  );

  const handleSideChange = useCallback(
    (side: "long" | "short") => {
      handleInputChange("side", side);
    },
    [handleInputChange]
  );

  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange("size", e.target.value);
    },
    [handleInputChange]
  );

  const calculations = useMemo(() => {
    const sizeNum = parseFloat(formData.size);
    const priceNum = currentPrice ? parseFloat(currentPrice.toString()) : 0;

    if (
      !ticker ||
      !currentPrice ||
      !formData.size ||
      isNaN(sizeNum) ||
      sizeNum <= 0
    ) {
      return { orderValue: 0, marginRequired: 0 };
    }

    const orderValue = sizeNum * priceNum;
    const marginRequired = orderValue / leverage;

    return { orderValue, marginRequired };
  }, [ticker, currentPrice, formData.size]);

  const accountValues = useMemo(() => {
    if (!accountData) {
      return { usdcBalance: "0.00", positionSize: "0.0000" };
    }

    const usdcBalance = parseFloat(
      accountData.crossMarginSummary?.accountValue || "0"
    ).toFixed(2);

    let positionSize = "0.0000";
    if (accountData.assetPositions && formData.coin) {
      const position = accountData.assetPositions.find(
        (pos: any) => pos.position.coin === formData.coin
      );
      if (position) {
        positionSize = parseFloat(position.position.szi || "0").toFixed(4);
      }
    }

    return { usdcBalance, positionSize };
  }, [accountData, formData.coin]);

  const validation = useMemo(() => {
    const usdcBalanceNum = parseFloat(accountValues.usdcBalance);
    const hasEnoughMargin = calculations.marginRequired <= usdcBalanceNum;
    const hasMinimumMargin = calculations.marginRequired >= 10;
    const sizeNum = parseFloat(formData.size);
    const isValidSize = !isNaN(sizeNum) && sizeNum > 0;

    return {
      hasEnoughMargin,
      hasMinimumMargin,
      isValidSize,
      canSubmit:
        hasEnoughMargin &&
        hasMinimumMargin &&
        isValidSize &&
        formData.size !== ""
    };
  }, [calculations.marginRequired, accountValues.usdcBalance, formData.size]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      resetOrder();

      if (!validation.canSubmit || !formData.coin) return;

      const orderRequest = {
        coin: formData.coin,
        side: formData.side,
        size: parseFloat(formData.size),
        leverage
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
    },
    [
      validation.canSubmit,
      formData.coin,
      formData.side,
      formData.size,
      placeOrder,
      resetOrder
    ]
  );

  const buttonText = useMemo(() => {
    if (isPlacing) return "Placing Order...";
    if (!validation.hasEnoughMargin) return "Not Enough Margin";
    if (!validation.hasMinimumMargin) return "Min Margin $10";
    if (!validation.isValidSize) return "Enter Size";
    return "Place Order";
  }, [isPlacing, validation]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Market Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4 mb-6">
          <SideButton
            side="long"
            currentSide={formData.side}
            label="Buy / Long"
            onClick={() => handleSideChange("long")}
          />
          <SideButton
            side="short"
            currentSide={formData.side}
            label="Sell / Short"
            onClick={() => handleSideChange("short")}
          />
          <LeverageDisplay leverage={leverage} />
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
                  `$${accountValues.usdcBalance}`
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
                `${accountValues.positionSize} ${formData.coin || "ETH"}`
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
              onChange={handleSizeChange}
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
              ${calculations.orderValue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Margin Required
            </span>
            <span
              className={`${
                (!validation.hasEnoughMargin || !validation.hasMinimumMargin) &&
                formData.size
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              ${calculations.marginRequired.toFixed(2)}
              {!validation.hasEnoughMargin && formData.size && (
                <span className="ml-1 text-xs">(Insufficient)</span>
              )}
              {!validation.hasMinimumMargin &&
                formData.size &&
                validation.hasEnoughMargin && (
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
          <StatusMessage
            type="error"
            message={orderError || accountError || ""}
            onClose={resetOrder}
          />
        )}

        {orderSuccess && (
          <StatusMessage
            type="success"
            message="Order placed successfully!"
            onClose={resetOrder}
          />
        )}

        <button
          type="submit"
          disabled={isPlacing || !validation.canSubmit}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isPlacing || !validation.canSubmit
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          }`}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
