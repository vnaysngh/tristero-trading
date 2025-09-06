const StatusMessage = ({
  type,
  message,
  onClose
}: {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}) => {
  const styles =
    type === "error"
      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
      : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400";

  const buttonStyles =
    type === "error"
      ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300";

  return (
    <div
      className={`${styles} border px-4 py-3 rounded-md flex justify-between items-center`}
    >
      <span>{message}</span>
      <button onClick={onClose} className={buttonStyles}>
        ×
      </button>
    </div>
  );
};

export default StatusMessage;
