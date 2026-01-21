const DB_NAME = 'mi-hogar';
const DB_VERSION = 2;
const STORES = ['shopping-items', 'expenses', 'events', 'tasks', 'gamification-profile', 'achievements'] as const;

type StoreName = (typeof STORES)[number];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCollection(store: StoreName, items: unknown[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(store, 'readwrite');
  const os = tx.objectStore(store);
  os.put(items, 'snapshot');
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function loadCollection<T = unknown>(store: StoreName): Promise<T[]> {
  const db = await openDB();
  const tx = db.transaction(store, 'readonly');
  const os = tx.objectStore(store);
  const req = os.get('snapshot');
  return new Promise<T[]>((resolve, reject) => {
    req.onsuccess = () => resolve((req.result as T[]) || []);
    req.onerror = () => reject(req.error);
  });
}
