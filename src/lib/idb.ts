// Tiny promise-based IndexedDB wrapper for storing uploaded GLTF/GLB blobs.
// localStorage is unsuitable for multi-MB binary models, so model bytes live
// here while their metadata lives in localStorage (see custom-furniture-store).

const DB_NAME = "spaceai";
const STORE = "models";
const VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
  });
}

export async function idbPutModel(id: string, blob: Blob): Promise<void> {
  await tx("readwrite", (s) => s.put(blob, id));
}

export async function idbGetModel(id: string): Promise<Blob | undefined> {
  return tx<Blob | undefined>("readonly", (s) => s.get(id));
}

export async function idbDeleteModel(id: string): Promise<void> {
  await tx("readwrite", (s) => s.delete(id));
}
