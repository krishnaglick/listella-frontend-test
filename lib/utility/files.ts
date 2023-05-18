"use client";

import { LocalStorageInstanceTypes, localStorage } from "./localforage";

export type File = {
  file: string;
  fileName: string;
};
export type FileStore = File[];

const filesKey = "FILES_KEY";

const getInstance = () => localStorage.getInstance(LocalStorageInstanceTypes.files);
const saveFiles = (files: FileStore) => getInstance().setItem(filesKey, files);

export const loadFiles = () =>
  getInstance()
    .getItem<FileStore>(filesKey)
    .then((v) => v ?? [])
    .catch(() => [] as FileStore);

export const saveFile = async (fileName: string, fileData: Blob) => {
  const files = await loadFiles();
  if (!files) {
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(fileData);
  return new Promise<void>((res) => {
    reader.addEventListener("load", async () => {
      files.push({ file: String(reader.result), fileName });
      console.debug("Saved", fileName);
      await saveFiles(files);
      res();
    });
  });
};

export const moveFile = async (to: number, from: number) => {
  const files = await loadFiles();
  if (!files) {
    return;
  }
  const temp = { ...files[to] };
  files[to] = files[from];
  files[from] = temp;
  console.log({ to, from });
  await saveFiles(files);
};
