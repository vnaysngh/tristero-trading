import { BarChartIcon } from "../Icons";

interface EmptyStateProps {
  title: string;
  description: string;
  colSpan: number;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  colSpan,
  icon = <BarChartIcon />
}: EmptyStateProps) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-12 text-center">
      <div className="text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </td>
  </tr>
);

export default EmptyState;
