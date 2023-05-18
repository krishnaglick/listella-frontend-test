import { FC } from "react";

interface PreviewButtonProps {
  disabled: boolean;
  preview: () => void;
  fileCount: number;
}

export const PreviewButton: FC<PreviewButtonProps> = ({ preview, disabled, fileCount }) => (
  <button
    type="button"
    onClick={preview}
    disabled={disabled}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end"
  >
    Preview {fileCount > 0 ? `${fileCount} images` : ""}
  </button>
);
