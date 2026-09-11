import Cookies from 'js-cookie';

type CookieAttributes = Cookies.CookieAttributes;

export function getCookie<T = string>(key: string): T | null {
  try {
    const value = Cookies.get(key);

    if (value === undefined) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  } catch {
    return null;
  }
}

export function setCookie<T>(
  key: string,
  value: T,
  options?: CookieAttributes,
) {
  try {
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    Cookies.set(key, serializedValue, options);
  } catch {
    // Ignore cookie errors
  }
}

export function removeCookie(key: string, options?: CookieAttributes) {
  try {
    Cookies.remove(key, options);
  } catch {
    // Ignore cookie errors
  }
}

export function getAllCookies() {
  try {
    return Object.entries(Cookies.get()).map(([name, value]) => ({
      name,
      value,
    }));
  } catch {
    return [];
  }
}

export const cookie = {
  get: getCookie,
  set: setCookie,
  remove: removeCookie,
  getAll: getAllCookies,
};
