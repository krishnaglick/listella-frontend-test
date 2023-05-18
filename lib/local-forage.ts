import localForage from "localforage";

export enum LocalStorageInstanceTypes {
  "files" = "files",
}

type LocalStorageMap<T> = {
  [s in LocalStorageInstanceTypes]: T;
};

const VERSIONS: LocalStorageMap<number> = {
  [LocalStorageInstanceTypes["files"]]: 1,
};

function generateStorageName(type: LocalStorageInstanceTypes, version = VERSIONS[type as LocalStorageInstanceTypes]) {
  return `${type}-${version}`;
}

class LocalStorageService {
  private instances = {} as LocalStorageMap<LocalForage>;

  constructor() {
    Object.keys(LocalStorageInstanceTypes).forEach((type) => {
      this.instances[type as LocalStorageInstanceTypes] = localForage.createInstance({
        name: generateStorageName(type as LocalStorageInstanceTypes),
      });
    });
    this.reapOldDocuments();
  }

  getInstance(key: LocalStorageInstanceTypes) {
    return this.instances[key];
  }

  private reapOldDocuments() {
    if (typeof window === "undefined") {
      return;
    }
    Object.entries(VERSIONS).forEach(([type, version]) => {
      if (version > 1) {
        for (let i = 1; i < version; i++) {
          localForage
            .dropInstance({
              name: generateStorageName(type as LocalStorageInstanceTypes, i),
            })
            .catch((err) => console.error("Error Removing Instance", err, type, i));
        }
      }
    });
  }
}

export const localStorage = new LocalStorageService();
