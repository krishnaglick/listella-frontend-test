"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { FileStore, moveFile as doMoveFile, loadFiles, saveFile as saveFileToLocal } from "../utility/files";

const FilesContext = createContext<ReturnType<typeof useFilesContextInit> | null>(null);

const useFilesContextInit = () => {
  const [files, updateFiles] = useState<FileStore>([]);

  useEffect(() => {
    loadFiles().then(updateFiles);
  }, []);

  const saveFile = useCallback(async (...args: Parameters<typeof saveFileToLocal>) => {
    await saveFileToLocal(...args);
    loadFiles().then(updateFiles);
  }, []);

  const moveFile = useCallback(async (...args: Parameters<typeof doMoveFile>) => {
    await doMoveFile(...args);
    loadFiles().then(updateFiles);
  }, []);

  return {
    files,
    saveFile,
    moveFile,
  };
};

export const useFilesContext = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("This context needs to be used within the FilesContextProvider");
  }

  return context;
};

export const FilesContextProvider = ({ children }: React.PropsWithChildren) => (
  <FilesContext.Provider value={useFilesContextInit()}>{children}</FilesContext.Provider>
);
