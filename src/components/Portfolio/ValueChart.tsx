import { getValueYPosition } from "@/utils";
import { ChartDataPoint } from "@/types";

function TotalValueChart({
  valuePolylinePoints,
  chartData,
  minValue,
  maxValue,
  range,
  midValue
}: {
  valuePolylinePoints: string;
  chartData: ChartDataPoint[];
  minValue: number;
  maxValue: number;
  range: number;
  midValue: number;
}) {
  return (
    <div className="h-64 relative">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 200"
        className="overflow-visible"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-200 dark:text-gray-700"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-600"
          points={valuePolylinePoints}
        />

        {chartData.map((point, index) => (
          <circle
            key={index}
            cx={(index / (chartData.length - 1)) * 380 + 10}
            cy={getValueYPosition(point.value, minValue, range)}
            r="3"
            fill="currentColor"
            className="text-blue-600"
          />
        ))}
      </svg>

      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>${maxValue.toFixed(2)}</span>
        <span>${midValue.toFixed(2)}</span>
        <span>${minValue.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default TotalValueChart;
