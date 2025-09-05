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
  return (
    <tr
      key={position.coin}
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
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={() => handleClosePosition(position.originalCoin)}
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
