import { LocalStorageInstanceTypes, localStorage } from "./localforage";

export type File = {
  file: string;
  fileName: string;
};

const filesKey = "FILES_KEY";

const getInstance = () => localStorage.getInstance(LocalStorageInstanceTypes.files);
export const saveFilesToStorage = (houseName: string, files: File[]) =>
  getInstance().setItem(filesKey + houseName, files);

export const loadFiles = (houseName: string) =>
  getInstance()
    .getItem<File[]>(filesKey + houseName)
    .then((v) => v ?? []);

export const encodeFiles = (files: FileList) =>
  Promise.all(
    Array.from(files).map((file) => {
      return new Promise<File>((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", async () => {
          res({ file: String(reader.result), fileName: file.name });
        });
      });
    })
  );

export const getHouses = async () => {
  const keys = await getInstance().keys();
  return keys.map((key) => key.replace(filesKey, ""));
};
