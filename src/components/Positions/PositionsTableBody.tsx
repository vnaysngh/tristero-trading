import { useAppState } from "@/state/store";
import { PositionsTableProps } from "@/types/trading";
import { getCalculations, getStyleClasses } from "@/utils";
import React from "react";

const PositionsTableBody = ({
  position,
  closingPositions,
  handleClosePosition
}: PositionsTableProps) => {
  const currentPrice = useAppState((s) => s.prices[position.coin]);
  const calculations = getCalculations(position, currentPrice);
  const styleClasses = getStyleClasses(calculations);

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

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {parseFloat(position.szi || "0").toFixed(4)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {parseFloat(position.positionValue || "0").toFixed(2)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.entryPx || "N/A"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {currentPrice}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <div className={`font-semibold ${styleClasses.pnlColor}`}>
              {calculations.pnlFormatted} ({calculations.roeFormatted})
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {parseFloat(position.liquidationPx || "0").toFixed(2)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {parseFloat(position.marginUsed || "0").toFixed(2)}
      </td>

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

export default PositionsTableBody;
