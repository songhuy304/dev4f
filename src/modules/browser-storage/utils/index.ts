import type { badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  ShieldQuestion,
  type LucideIcon,
} from 'lucide-react';
import type { CookieFormValues } from '../types';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

interface SameSiteInfo {
  label: string;
  icon: LucideIcon;
  variant: BadgeVariant;
}

const getSameSite = (
  sameSite: chrome.cookies.Cookie['sameSite'] | undefined,
): SameSiteInfo => {
  switch (sameSite) {
    case 'strict':
      return {
        label: 'Strict',
        icon: ShieldCheck,
        variant: 'success',
      };

    case 'lax':
      return {
        label: 'Lax',
        icon: ShieldAlert,
        variant: 'outline',
      };

    case 'no_restriction':
      return {
        label: 'None',
        icon: ShieldOff,
        variant: 'warning',
      };

    case 'unspecified':
    default:
      return {
        label: 'Unspecified',
        icon: ShieldQuestion,
        variant: 'outline',
      };
  }
};

const getCookieKey = (
  cookie: Pick<chrome.cookies.Cookie, 'name' | 'domain' | 'path'>,
) => `${cookie.name}|${cookie.domain}|${cookie.path}`;

const buildCookieUrl = (
  domain: string,
  path: string,
  secure: boolean,
  fallbackUrl?: string,
) => {
  if (!domain && fallbackUrl) {
    return fallbackUrl;
  }

  const host = domain.startsWith('.') ? domain.slice(1) : domain;
  if (!host) {
    return fallbackUrl ?? '';
  }

  const protocol = secure ? 'https:' : 'http:';
  const cookiePath = path || '/';
  return `${protocol}//${host}${cookiePath.startsWith('/') ? cookiePath : `/${cookiePath}`}`;
};

const toExpirationDate = (
  expires: CookieFormValues['expires'],
): number | undefined => {
  if (expires == null || expires === '') {
    return undefined;
  }

  if (typeof expires === 'number') {
    return expires < 1e12 ? expires : Math.floor(expires / 1000);
  }

  const date = expires instanceof Date ? expires : new Date(expires);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return Math.floor(date.getTime() / 1000);
};

const cookieToFormValues = (
  cookie: chrome.cookies.Cookie,
): CookieFormValues => ({
  name: cookie.name,
  value: cookie.value,
  domain: cookie.domain,
  path: cookie.path,
  expires: cookie.expirationDate
    ? new Date(cookie.expirationDate * 1000)
    : undefined,
  secure: cookie.secure,
  httpOnly: cookie.httpOnly,
  sameSite: cookie.sameSite ?? 'unspecified',
});

const formValuesToSetDetails = (
  values: CookieFormValues,
  fallbackUrl?: string,
): chrome.cookies.SetDetails => {
  const secure = values.secure || values.sameSite === 'no_restriction';
  const url = buildCookieUrl(values.domain, values.path, secure, fallbackUrl);
  const expirationDate = toExpirationDate(values.expires);

  return {
    url,
    name: values.name,
    value: values.value,
    domain: values.domain || undefined,
    path: values.path || '/',
    secure,
    httpOnly: values.httpOnly,
    sameSite: values.sameSite,
    ...(expirationDate != null ? { expirationDate } : {}),
  };
};

const cookieToRemoveDetails = (
  cookie: Pick<
    chrome.cookies.Cookie,
    'name' | 'domain' | 'path' | 'secure' | 'storeId'
  >,
  fallbackUrl?: string,
): chrome.cookies.CookieDetails => ({
  url: buildCookieUrl(cookie.domain, cookie.path, cookie.secure, fallbackUrl),
  name: cookie.name,
  storeId: cookie.storeId,
});

export {
  buildCookieUrl,
  cookieToFormValues,
  cookieToRemoveDetails,
  formValuesToSetDetails,
  getCookieKey,
  getSameSite,
};
export type { SameSiteInfo };
