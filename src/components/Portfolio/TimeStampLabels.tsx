import { formatTimestampByTimeframe } from "@/utils";
import { TimeframeKey } from "@/types";

function TimestampLabels({
  firstTimestamp,
  lastTimestamp,
  selectedTimeframe
}: {
  firstTimestamp: number;
  lastTimestamp: number;
  selectedTimeframe: TimeframeKey;
}) {
  return (
    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
      <span>
        {formatTimestampByTimeframe(firstTimestamp, selectedTimeframe)}
      </span>
      <span>
        {formatTimestampByTimeframe(lastTimestamp, selectedTimeframe)}
      </span>
    </div>
  );
}

export default TimestampLabels;
