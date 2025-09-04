"use client";

import { useState, useTransition, useEffect } from "react";
import { tradingService, MarketOrderRequest } from "@/lib/trading-service";
import { useMarketData } from "@/hooks/useMarket";

interface MarketTradingFormProps {
  selectedSymbol?: string;
  currentPrice?: string;
}

export function MarketTradingForm({
  selectedSymbol,
  currentPrice
}: MarketTradingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    coin: selectedSymbol || "",
    side: "long" as "long" | "short",
    size: "",
    sizePercentage: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [orderValue, setOrderValue] = useState(0);
  const [marginRequired, setMarginRequired] = useState(0);

  useEffect(() => {
    if (selectedSymbol && selectedSymbol !== formData.coin) {
      setFormData((prev) => ({
        ...prev,
        coin: selectedSymbol
      }));
      setFormData((prev) => ({
        ...prev,
        size: "",
        sizePercentage: 0
      }));
      setOrderValue(0);
      setMarginRequired(0);
    }
  }, [selectedSymbol, formData.coin]);

  const { markets } = useMarketData();

  const leverage = 2;

  const calculateOrderDetails = (size: number) => {
    if (!selectedSymbol || !currentPrice) return;

    const price = parseFloat(currentPrice.toString());
    const calculatedOrderValue = size * price;
    const calculatedMarginRequired = calculatedOrderValue / leverage;

    setOrderValue(calculatedOrderValue);
    setMarginRequired(calculatedMarginRequired);
  };

  const hasEnoughMargin = () => {
    const usdcBalance = parseFloat(getUSDCBalance());
    return marginRequired <= usdcBalance;
  };

  const fetchAccountData = async (userAddress: string) => {
    setLoadingBalance(true);
    try {
      const result = await tradingService.getClearinghouseState(userAddress);
      if (result.success) {
        setAccountData(result.data);
      } else {
        console.error("Failed to fetch account data:", result.error);
      }
    } catch (err) {
      console.error("Error fetching account data:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleInitialize = async () => {
    const config = {
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
      userAddress: "",
      testnet: false,
      vaultAddress: undefined as string | undefined
    };

    if (!config.privateKey) {
      setError(
        "Please configure your private key and user address in environment variables. Create a .env.local file with NEXT_PUBLIC_PRIVATE_KEY and NEXT_PUBLIC_USER_ADDRESS"
      );
      return;
    }

    try {
      await tradingService.initialize(config);
      setIsInitialized(true);
      setSuccess("Trading service initialized successfully!");

      await fetchAccountData("0x32664952e3CE32189b193a4E4A918b460b271D61");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize trading service"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isInitialized) {
      setError("Please initialize the trading service first");
      return;
    }

    if (!formData.coin || !formData.size) {
      setError("Please select a coin and enter a size");
      return;
    }

    const size = parseFloat(formData.size);
    if (isNaN(size) || size <= 0) {
      setError("Please enter a valid size");
      return;
    }

    startTransition(async () => {
      try {
        await tradingService.updateLeverage(`${formData.coin}-PERP`, leverage);

        const orderRequest: MarketOrderRequest = {
          coin: formData.coin,
          isBuy: formData.side === "long",
          size: size,
          leverage: leverage
        };

        const result = await tradingService.placeMarketOrder(orderRequest);

        if (result.success) {
          setSuccess("Market order placed successfully!");
          setFormData((prev) => ({
            ...prev,
            size: "",
            sizePercentage: 0
          }));
        } else {
          setError(result.error || "Failed to place market order");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      }
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);

    if (field === "size") {
      calculateOrderDetails(parseFloat(value.toString()) || 0);
    }
  };

  useEffect(() => {
    if (formData.size && selectedSymbol && currentPrice) {
      calculateOrderDetails(parseFloat(formData.size.toString()));
    }
  }, [formData.size, selectedSymbol, currentPrice]);

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

      {!isInitialized && (
        <div className="mb-6">
          <button
            onClick={handleInitialize}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Initialize Trading
          </button>
        </div>
      )}

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
              {isInitialized && (
                <button
                  type="button"
                  onClick={() =>
                    fetchAccountData(
                      "0x32664952e3CE32189b193a4E4A918b460b271D61"
                    )
                  }
                  disabled={loadingBalance}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                >
                  {loadingBalance ? "..." : "↻"}
                </button>
              )}
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
                !hasEnoughMargin() && formData.size
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              ${marginRequired.toFixed(2)}
              {!hasEnoughMargin() && formData.size && (
                <span className="ml-1 text-xs">(Insufficient)</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Leverage</span>
            <span className="text-gray-900 dark:text-white">{leverage}x</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={
            isPending ||
            !isInitialized ||
            !hasEnoughMargin() ||
            !formData.size ||
            parseFloat(formData.size.toString()) <= 0
          }
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isPending ||
            !isInitialized ||
            !hasEnoughMargin() ||
            !formData.size ||
            parseFloat(formData.size.toString()) <= 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          }`}
        >
          {isPending
            ? "Placing Order..."
            : !hasEnoughMargin() && isInitialized
            ? "Not Enough Margin"
            : !formData.size || parseFloat(formData.size.toString()) <= 0
            ? "Enter Size"
            : "Place Order"}
        </button>
      </form>
    </div>
  );
}
