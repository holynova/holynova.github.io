let database;
let persistent = true;
const mediaFallback = new Map();
const masksFallback = new Map();

function openDatabase() {
  database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open('photo-breakout', 1);
    request.onupgradeneeded = () => {
      for (const name of ['photos', 'files', 'masks']) request.result.createObjectStore(name);
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('History database is busy'));
  });
  return database;
}

async function transact(names, mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(names, mode);
    const request = callback(name => tx.objectStore(name));
    tx.oncomplete = () => resolve(request?.result);
    tx.onabort = () => reject(tx.error || new Error('History transaction aborted'));
  });
}

export async function listPhotos() {
  try {
    return await transact(['photos'], 'readonly', store => store('photos').getAll());
  } catch {
    persistent = false;
    return [];
  }
}

export async function addPhoto(photo, file) {
  if (persistent) {
    try {
      await transact(['photos', 'files'], 'readwrite', store => {
        store('photos').put(photo, photo.id);
        store('files').put(file, photo.id);
      });
      return true;
    } catch {
      // The photo is still editable for this visit if storage is full or unavailable.
    }
  }
  mediaFallback.set(photo.id, file);
  return false;
}

export async function readFile(id) {
  if (mediaFallback.has(id)) return mediaFallback.get(id);
  return transact(['files'], 'readonly', store => store('files').get(id));
}

export async function savePhoto(photo) {
  if (mediaFallback.has(photo.id)) return false;
  try {
    await transact(['photos'], 'readwrite', store => store('photos').put(photo, photo.id));
    return true;
  } catch {
    return false;
  }
}

export async function readMask(id) {
  if (masksFallback.has(id)) return masksFallback.get(id);
  if (mediaFallback.has(id)) return undefined;
  return transact(['masks'], 'readonly', store => store('masks').get(id));
}

export async function saveMask(id, edit) {
  if (!mediaFallback.has(id)) {
    try {
      await transact(['masks'], 'readwrite', store => store('masks').put(edit, id));
      masksFallback.delete(id);
      return true;
    } catch {
      // Keep the most recent mask available when switching photos in this visit.
    }
  }
  masksFallback.set(id, edit);
  return false;
}

export async function removePhoto(id) {
  if (!mediaFallback.has(id)) {
    try {
      await transact(['photos', 'files', 'masks'], 'readwrite', store => {
        for (const name of ['photos', 'files', 'masks']) store(name).delete(id);
      });
    } catch {
      return false;
    }
  }
  mediaFallback.delete(id);
  masksFallback.delete(id);
  return true;
}
