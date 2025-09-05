import { leverage } from "@/constants";
import { memo } from "react";

const OrderDetails = memo(
  ({
    calculations,
    validation,
    formData
  }: {
    calculations: any;
    validation: any;
    formData: any;
  }) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Order Value</span>
        <span className="text-gray-900 dark:text-white">
          ${calculations.orderValue.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Margin Required
        </span>
        <span
          className={`${
            (!validation.hasEnoughMargin || !validation.hasMinimumMargin) &&
            formData.size
              ? "text-red-600 dark:text-red-400"
              : "text-gray-900 dark:text-white"
          }`}
        >
          ${calculations.marginRequired.toFixed(2)}
          {!validation.hasEnoughMargin && formData.size && (
            <span className="ml-1 text-xs">(Insufficient)</span>
          )}
          {!validation.hasMinimumMargin &&
            formData.size &&
            validation.hasEnoughMargin && (
              <span className="ml-1 text-xs">(Min $10)</span>
            )}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Leverage</span>
        <span className="text-gray-900 dark:text-white">{leverage}x</span>
      </div>
    </div>
  )
);

export default OrderDetails;
