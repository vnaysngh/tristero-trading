import { ChartDataPoint } from "@/types";
import { getPnlYPosition } from "@/utils";

function PNLChart({
  chartData,
  maxPnl
}: {
  chartData: ChartDataPoint[];
  maxPnl: number;
}) {
  return (
    <div className="h-32 relative">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">P&L</div>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 100"
        className="overflow-visible"
      >
        <line
          x1="10"
          y1="50"
          x2="390"
          y2="50"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-300 dark:text-gray-600"
        />

        {chartData.map((point, index) => {
          const x = (index / (chartData.length - 1)) * 380 + 10 - 2;
          const pnlY = getPnlYPosition(point.pnl, maxPnl);
          const barHeight = Math.abs(pnlY - 50);
          const barY = Math.min(pnlY, 50);
          const isPositive = point.pnl >= 0;

          return (
            <rect
              key={index}
              x={x}
              y={barY}
              width="4"
              height={barHeight}
              fill="currentColor"
              className={isPositive ? "text-green-500" : "text-red-500"}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default PNLChart;
