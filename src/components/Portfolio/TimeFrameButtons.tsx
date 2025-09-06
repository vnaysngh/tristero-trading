import { timeframes } from "@/constants";
import { TimeframeKey } from "@/types/trading";

export function TimeFrameButtons({
  selectedTimeframe,
  setSelectedTimeframe
}: {
  selectedTimeframe: TimeframeKey;
  setSelectedTimeframe: (timeframe: TimeframeKey) => void;
}) {
  return (
    <div className="flex space-x-2">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe.key}
          onClick={() => setSelectedTimeframe(timeframe.key)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedTimeframe === timeframe.key
              ? "bg-blue-600 text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
}

export default TimeFrameButtons;
