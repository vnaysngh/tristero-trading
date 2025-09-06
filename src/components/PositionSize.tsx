const PositionSize = ({
  size,
  coin,
  handleSizeChange
}: {
  size: string;
  coin: string;
  handleSizeChange: any;
}) => (
  <div>
    <label
      htmlFor="size"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      Size
    </label>
    <div className="flex w-full">
      <input
        type="number"
        id="size"
        value={size}
        onChange={handleSizeChange}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-0"
        placeholder="Enter size"
        required
      />
      <div className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-24 flex-shrink-0 flex items-center justify-center">
        <span className="text-sm font-medium">{coin || "ETH"}</span>
      </div>
    </div>
  </div>
);

export default PositionSize;
