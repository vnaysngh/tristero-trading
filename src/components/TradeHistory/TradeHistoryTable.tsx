import { ProcessedPosition } from "@/types/trading";
import { getDirectionColorClass, getPnlColorClass } from "@/utils";
import React from "react";

export const TradeHistoryTable = ({
  position
}: {
  position: ProcessedPosition;
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
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
          className={`font-medium ${getDirectionColorClass(
            position.direction
          )}`}
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
        {position.closedPnl !== "NaN USDC" ? (
          <div className="flex items-center space-x-2">
            <span
              className={`font-medium ${getPnlColorClass(
                position.closedPnlValue
              )}`}
            >
              {position.closedPnl}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">N/A</span>
        )}
      </td>
    </tr>
  );
};
