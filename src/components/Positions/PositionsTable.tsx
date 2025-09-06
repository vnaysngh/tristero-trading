import { useAppState } from "@/state/store";
import { PositionsTableProps } from "@/types/trading";
import { formatPrice } from "@/utils";
import React from "react";

const PositionsTable = ({
  position,
  closingPositions,
  handleClosePosition
}: PositionsTableProps) => {
  const currentPrice = useAppState((s) => s.prices[position.coin]);

  const getCalculations = () => {
    const size = parseFloat(position.szi || "0");
    const currentPriceNum = parseFloat(currentPrice);
    const entryPrice = position.entryPx;
    const marginUsed = parseFloat(position.marginUsed || "0");

    const isLong = size > 0;
    const isShort = size < 0;

    const priceDifference = isLong
      ? currentPriceNum - entryPrice
      : entryPrice - currentPriceNum;

    const pnl = Math.abs(size) * priceDifference;
    const roe = marginUsed > 0 ? (pnl / marginUsed) * 100 : 0;

    return {
      size,
      isLong,
      isShort,
      pnl,
      roe,
      pnlFormatted:
        pnl >= 0
          ? `+$${formatPrice(pnl.toString())}`
          : `-$${formatPrice(Math.abs(pnl).toString())}`,
      roeFormatted:
        roe >= 0
          ? `+${formatPrice(roe.toString())}%`
          : `${formatPrice(roe.toString())}%`
    };
  };

  const calculations = getCalculations();

  const getStyleClasses = () => ({
    positionIndicator: calculations.isLong
      ? "bg-green-500"
      : calculations.isShort
      ? "bg-red-500"
      : "bg-gray-400",

    positionBadge: calculations.isLong
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : calculations.isShort
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",

    pnlColor:
      calculations.pnl > 0
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400"
  });

  const styleClasses = getStyleClasses();

  const isClosing = closingPositions.has(position.coin);
  const leverageDisplay = position.leverage?.value || 1;
  const positionType = calculations.isLong
    ? "LONG"
    : calculations.isShort
    ? "SHORT"
    : "NEUTRAL";

  const handleClose = () => {
    handleClosePosition(`${position.coin}-PERP`);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
      {/* Position Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div
            className={`w-1 h-8 rounded-full ${styleClasses.positionIndicator}`}
          />
          <div className="font-semibold text-gray-900 dark:text-white">
            {position.coin} {leverageDisplay}x
            <span
              className={`ml-2 text-xs px-2 py-1 rounded-full ${styleClasses.positionBadge}`}
            >
              {positionType}
            </span>
          </div>
        </div>
      </td>

      {/* Size */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.szi || 0}
      </td>

      {/* Position Value */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.positionValue || 0}
      </td>

      {/* Entry Price */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.entryPx || "N/A"}
      </td>

      {/* Current Price */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {currentPrice}
      </td>

      {/* PnL & ROE */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <div className={`font-semibold ${styleClasses.pnlColor}`}>
              {calculations.pnlFormatted} ({calculations.roeFormatted})
            </div>
          </div>
        </div>
      </td>

      {/* Liquidation Price */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.liquidationPx}
      </td>

      {/* Margin Used */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.marginUsed}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={handleClose}
          disabled={isClosing}
          className={`text-sm font-medium transition-colors ${
            isClosing
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 cursor-pointer"
          }`}
        >
          {isClosing ? "Closing..." : "Market"}
        </button>
      </td>
    </tr>
  );
};

export default PositionsTable;
