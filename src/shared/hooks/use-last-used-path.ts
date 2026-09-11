import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { EXT_MESSAGE, findNavItemByUrl } from '@/shared/constant';
import { cookie } from '@/shared/utils';

export const LAST_USED_PATH_KEY = 'last-used-path';

const COOKIE_OPTIONS = { expires: 365, path: '/' } as const;

export function useLastUsedPath() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRestoredOnMountRef = useRef(false);

  useEffect(() => {
    if (location.pathname === '/' || !findNavItemByUrl(location.pathname)) {
      return;
    }

    cookie.set(LAST_USED_PATH_KEY, location.pathname, COOKIE_OPTIONS);
  }, [location.pathname]);

  useEffect(() => {
    const restore = () => {
      if (location.pathname !== '/') return;

      const lastPath = cookie.get<string>(LAST_USED_PATH_KEY);
      if (!lastPath || !findNavItemByUrl(lastPath)) return;

      navigate(lastPath, { replace: true });
    };

    if (!hasRestoredOnMountRef.current) {
      hasRestoredOnMountRef.current = true;
      restore();
    }

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== EXT_MESSAGE.OVERLAY_OPENED) return;
      restore();
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [location.pathname, navigate]);
}
