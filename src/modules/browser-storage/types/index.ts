export interface LocalStorageFormValues {
  name: string;
  value: string;
}

export interface LocalStorageItem {
  name: string;
  value: string;
}

export interface SessionStorageItem {
  name: string;
  value: string;
}

export interface CookieFormValues {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: Date | string | number | undefined;
  secure: boolean;
  httpOnly: boolean;
  sameSite: NonNullable<chrome.cookies.Cookie['sameSite']>;
}
