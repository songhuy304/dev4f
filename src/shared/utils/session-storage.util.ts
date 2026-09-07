export function getSessionStorage<T>(key: string): T | null {
  try {
    const value = window.sessionStorage.getItem(key);

    return value !== null ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function setSessionStorageRaw(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore localStorage errors
  }
}

export function setSessionStorage<T>(key: string, value: T) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors
  }
}

export function removeSessionStorage(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore localStorage errors
  }
}

export function clearSessionStorage() {
  try {
    window.sessionStorage.clear();
  } catch {
    // Ignore localStorage errors
  }
}

export function getAllSessionStorage() {
  return Object.entries(window.sessionStorage).map(([name, value]) => ({
    name,
    value,
  }));
}

export const sessionStorage = {
  get: getSessionStorage,
  set: setSessionStorage,
  setRaw: setSessionStorageRaw,
  remove: removeSessionStorage,
  clear: clearSessionStorage,
  getAll: getAllSessionStorage,
};
