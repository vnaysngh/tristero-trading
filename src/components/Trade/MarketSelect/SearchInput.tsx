import { SearchIcon } from "@/components/Icons";

const SearchInput = ({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        placeholder="Search assets..."
        autoFocus
      />
    </div>
  </div>
);

export default SearchInput;
