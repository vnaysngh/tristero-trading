import Link from "next/link";
import { NAV_ITEMS } from "@/constants";

const Navigation = ({ currentPath }: { currentPath: string }) => (
  <nav className="mt-6">
    <div className="flex space-x-8">
      {NAV_ITEMS.map((item) => {
        const isActive = currentPath === item.href;
        const linkClasses = isActive
          ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors duration-200 ${linkClasses}`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  </nav>
);

export default Navigation;
