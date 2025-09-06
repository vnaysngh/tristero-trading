import { WarningIcon } from "../Icons";

const ErrorState = ({
  error,
  onRetry
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
        <WarningIcon />
      </div>
      <p className="text-red-600 dark:text-red-400 font-medium mb-2">
        Failed to load positions
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorState;
