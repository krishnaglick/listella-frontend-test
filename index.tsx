"use client";

import { useCallback, useRef, useState } from "react";
import { Dropzone } from "./components/Dropzone";
import { Images } from "./components/Images";
import { PreviewButton } from "./components/PreviewButton";
import { UploadButton } from "./components/UploadButton";
import "./index.scss";
import { File, encodeFiles, getHouses, loadFiles, saveFilesToStorage } from "./lib/files";

export const Uploader = () => {
  const uploader = useRef<HTMLInputElement>(null);
  const [fileCount, setFileCount] = useState(0);
  const [actionRunning, setActionRunning] = useState(false);
  const [homeName, setHomeName] = useState("");
  const [processedFiles, setProcessedFiles] = useState<File[]>([]);

  const upload = useCallback(async () => {
    if (!processedFiles.length) {
      return;
    }
    setActionRunning(true);
    await saveFilesToStorage(homeName, processedFiles);
    setFileCount(0);
    setActionRunning(false);
    setProcessedFiles([]);
  }, [homeName, processedFiles]);

  const preview = useCallback(async () => {
    if (!uploader.current?.files) {
      return;
    }
    setActionRunning(true);
    setProcessedFiles(await encodeFiles(uploader.current.files));
    setActionRunning(false);
    setFileCount(0);
  }, []);

  const reorderImage = useCallback(
    (to: number, from: number) => {
      const newFiles = [...processedFiles];
      const temp = { ...newFiles[to] };
      newFiles[to] = newFiles[from];
      newFiles[from] = temp;
      setProcessedFiles(newFiles);
    },
    [processedFiles]
  );

  const loadHome = useCallback(async () => {
    const homes = await getHouses();
    const chosenHome = prompt(`Choose a home: ${homes.join("\n")}`);
    if (chosenHome) {
      const files = await loadFiles(chosenHome);
      setProcessedFiles(files);
      setHomeName(chosenHome);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h2>Save a Home</h2>
      <button onClick={loadHome}>Load a home</button>
      <div className="flex gap-3">
        <label htmlFor="homeName">Home Name</label>
        <input
          className="border border-indigo-600 border-3"
          type="text"
          onChange={(e) => setHomeName(e.target.value)}
          id="homeName"
        />
      </div>
      {processedFiles.length <= 0 && <Dropzone uploader={uploader} setFileCount={setFileCount} />}
      <div className="flex gap-3">
        <PreviewButton disabled={actionRunning || fileCount === 0} preview={preview} fileCount={fileCount} />
        <UploadButton
          fileCount={processedFiles.length}
          disabled={Boolean(actionRunning || !processedFiles.length || !homeName)}
          upload={upload}
        />
      </div>

      <Images images={processedFiles} reorderImage={reorderImage} />
    </div>
  );
};
