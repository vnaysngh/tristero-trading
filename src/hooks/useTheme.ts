import { useAppState } from "@/state/store";
import { useEffect } from "react";

const useTheme = () => {
  const theme = useAppState((s) => s.theme);
  const setTheme = useAppState((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme };
};

export default useTheme;
