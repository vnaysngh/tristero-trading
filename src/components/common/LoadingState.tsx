interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-8 text-center">
      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

export default LoadingState;
