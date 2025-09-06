export function getPnlColorClass(value: number): string {
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
}

export function getDirectionColorClass(direction: string): string {
  return direction.toLowerCase() === "long" || direction.toLowerCase() === "buy"
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
}

export function getChangeTypeClass(
  changeType: "positive" | "negative" | null
): string {
  switch (changeType) {
    case "positive":
      return "text-green-600 dark:text-green-400";
    case "negative":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-500 dark:text-gray-400";
  }
}

export function getStyleClasses(calculations: any) {
  const isLong = calculations.isLong;
  const isShort = calculations.isShort;
  const pnl = calculations.pnl;

  return {
    positionIndicator: isLong
      ? "bg-green-500"
      : isShort
      ? "bg-red-500"
      : "bg-gray-400",
    positionBadge: isLong
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : isShort
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    pnlColor:
      pnl >= 0
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400"
  };
}
