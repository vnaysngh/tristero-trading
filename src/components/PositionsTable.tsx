import { formatPrice } from "@/lib/api";
import { useAppState } from "@/state/store";
import React from "react";

const PositionsTable = ({
  position,
  closingPositions,
  handleClosePosition
}: {
  position: any;
  closingPositions: any;
  handleClosePosition: (coin: string) => void;
}) => {
  const currentPrice = useAppState((s) => s.prices[position.coin]);

  const size = parseFloat(position.szi || "0");

  const priceDifference =
    size >= 0
      ? parseFloat(currentPrice) - position.entryPx
      : position.entryPx - parseFloat(currentPrice);
  const pnl = Math.abs(size) * priceDifference;
  const pnlComp =
    Math.abs(size) * priceDifference
      ? `+$${formatPrice(pnl.toString())}`
      : `-$${formatPrice(Math.abs(pnl).toString())}`;
  const marginUsed = parseFloat(position.marginUsed || "0");

  const roe = marginUsed > 0 ? (pnl / marginUsed) * 100 : 0; // ROE = PnL / margin_used * 100
  const roeComp =
    roe >= 0
      ? `+${formatPrice(roe.toString())}%`
      : `${formatPrice(roe.toString())}%`;
  return (
    <tr
      key={position.coin}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {position.coin} {position.leverage?.value || 1}x
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.szi || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.positionValue || 0}
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
            <div
              className={`font-semibold ${
                pnl > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {pnlComp} ({roeComp})
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {position.liquidationPx}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-900 dark:text-white">
            {position.marginUsed}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={() => handleClosePosition(`${position.coin}-PERP`)}
            disabled={closingPositions.has(position.coin)}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              closingPositions.has(position.coin)
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            }`}
          >
            {closingPositions.has(position.coin) ? "Closing..." : "Market"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PositionsTable;
