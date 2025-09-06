import { leverage } from "@/constants";

const OrderDetails = ({
  orderValue,
  marginRequired,
  hasMinimumMargin,
  hasEnoughMargin,
  size
}: {
  orderValue: number;
  marginRequired: number;
  hasMinimumMargin: boolean;
  hasEnoughMargin: boolean;
  size: string;
}) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">Order Value</span>
      <span className="text-gray-900 dark:text-white">
        ${orderValue.toFixed(2)}
      </span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">Margin Required</span>
      <span
        className={`${
          (!hasEnoughMargin || !hasMinimumMargin) && size
            ? "text-red-600 dark:text-red-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        ${marginRequired.toFixed(2)}
        {!hasEnoughMargin && size && (
          <span className="ml-1 text-xs">(Insufficient)</span>
        )}
        {!hasMinimumMargin && size && hasEnoughMargin && (
          <span className="ml-1 text-xs">(Min $10)</span>
        )}
      </span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">Leverage</span>
      <span className="text-gray-900 dark:text-white">{leverage}x</span>
    </div>
  </div>
);

export default OrderDetails;
