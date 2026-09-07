export function getLocalStorage<T>(key: string): T | null {
  try {
    const value = window.localStorage.getItem(key);

    return value !== null ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function setLocalStorageRaw(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore localStorage errors
  }
}

export function setLocalStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors
  }
}

export function removeLocalStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore localStorage errors
  }
}

export function clearLocalStorage() {
  try {
    window.localStorage.clear();
  } catch {
    // Ignore localStorage errors
  }
}

export function getAllLocalStorage() {
  return Object.entries(window.localStorage).map(([name, value]) => ({
    name,
    value,
  }));
}

export const localStorage = {
  get: getLocalStorage,
  set: setLocalStorage,
  setRaw: setLocalStorageRaw,
  remove: removeLocalStorage,
  clear: clearLocalStorage,
  getAll: getAllLocalStorage,
};
