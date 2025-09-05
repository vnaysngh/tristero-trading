const LeverageDisplay = ({ leverage }: { leverage: number }) => (
  <div className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md cursor-not-allowed opacity-60">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {leverage}x
    </span>
  </div>
);

export default LeverageDisplay;
