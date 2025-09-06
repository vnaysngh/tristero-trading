interface TableHeaderProps {
  headers: string[];
}

const TableHeader = ({ headers }: TableHeaderProps) => (
  <thead className="bg-gray-50 dark:bg-gray-900">
    <tr>
      {headers.map((header) => (
        <th
          key={header}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHeader;
