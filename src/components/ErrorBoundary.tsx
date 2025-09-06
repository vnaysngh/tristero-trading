"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { WarningIcon } from "./Icons";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mx-4 my-8">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <WarningIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Error occurred
          </h3>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {error.message || "Something went wrong. Please try again."}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export function ErrorBoundary({
  children,
  fallback: Fallback = ErrorFallback
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary FallbackComponent={Fallback}>
      {children}
    </ReactErrorBoundary>
  );
}
