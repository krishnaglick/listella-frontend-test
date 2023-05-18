import { FC } from "react";

interface UploadButtonProps {
  upload: () => void;
  disabled: boolean;
  fileCount: number;
}

export const UploadButton: FC<UploadButtonProps> = ({ upload, disabled, fileCount }) => (
  <button
    type="button"
    onClick={upload}
    disabled={disabled}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end"
  >
    Upload {fileCount ? `${fileCount} files` : ""}
  </button>
);
