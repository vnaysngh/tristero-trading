import { Theme } from "@/types";
import { MoonIcon, SunIcon } from "../Icons";

const ThemeToggle = ({
  theme,
  onToggle
}: {
  theme: Theme;
  onToggle: () => void;
}) => {
  const isLight = theme === "light";
  const themeLabel = isLight ? "Light" : "Dark";

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
        title={`Current theme: ${themeLabel}`}
      >
        {!isLight ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
};

export default ThemeToggle;
