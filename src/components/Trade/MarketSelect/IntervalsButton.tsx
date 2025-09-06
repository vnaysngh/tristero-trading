import { Interval } from "@/types/trading";

const IntervalButton = ({
  interval,
  isSelected,
  onClick
}: {
  interval: Interval;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const buttonClasses = isSelected
    ? "bg-blue-600 text-white"
    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${buttonClasses}`}
    >
      {interval.label}
    </button>
  );
};

export default IntervalButton;
