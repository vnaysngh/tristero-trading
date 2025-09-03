"use client";

import { useState, useTransition } from "react";
import { useMarketData, usePriceData } from "@/hooks/useMarket";
import { formatPrice } from "@/lib/api";

interface TradingFormProps {
  selectedCoin?: string;
}

export function TradingForm({ selectedCoin }: TradingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    coin: selectedCoin || "",
    side: "long" as "long" | "short",
    size: "",
    price: "" // Optional for market orders
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { markets } = useMarketData();
  const { prices } = usePriceData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const currentPrice = formData.coin ? prices[formData.coin] : null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Create Position
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="coin"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Asset
          </label>
          <select
            id="coin"
            value={formData.coin}
            onChange={(e) => handleInputChange("coin", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Select an asset</option>
            {markets
              .filter((market) => prices[market.name])
              .map((market) => (
                <option key={market.name} value={market.name}>
                  {market.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position Side
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="side"
                value="long"
                checked={formData.side === "long"}
                onChange={(e) => handleInputChange("side", e.target.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-green-600 dark:text-green-400 font-medium">
                Long
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="side"
                value="short"
                checked={formData.side === "short"}
                onChange={(e) => handleInputChange("side", e.target.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-red-600 dark:text-red-400 font-medium">
                Short
              </span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Size
          </label>
          <input
            type="number"
            id="size"
            value={formData.size}
            onChange={(e) => handleInputChange("size", e.target.value)}
            step="0.001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter position size"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Entry Price (Optional - Market Order if empty)
          </label>
          <div className="relative">
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder={
                currentPrice ? formatPrice(currentPrice) : "Enter price"
              }
            />
            {currentPrice && (
              <button
                type="button"
                onClick={() => handleInputChange("price", currentPrice)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Market: ${formatPrice(currentPrice)}
              </button>
            )}
          </div>
        </div>

        {currentPrice && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current {formData.coin} Price:
              <span className="ml-2 font-mono font-semibold text-gray-900 dark:text-white">
                ${formatPrice(currentPrice)}
              </span>
            </div>
          </div>
        )}

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
          disabled={isPending}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isPending
              ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isPending ? "Creating Position..." : "Create Position"}
        </button>
      </form>
    </div>
  );
}
