import { memo } from "react";

const SubmitButton = memo(
  ({
    isPlacing,
    validation,
    buttonText
  }: {
    isPlacing: boolean;
    validation: any;
    buttonText: string;
  }) => (
    <button
      type="submit"
      disabled={isPlacing || !validation.canSubmit}
      className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
        isPlacing || !validation.canSubmit
          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      }`}
    >
      {buttonText}
    </button>
  )
);

export default SubmitButton;
