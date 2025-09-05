import React, { memo } from "react";

const SideButton = memo(
  ({
    side,
    currentSide,
    label,
    onClick
  }: {
    side: "long" | "short";
    currentSide: "long" | "short";
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
        currentSide === side
          ? "bg-teal-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  )
);

export default SideButton;
