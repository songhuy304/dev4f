import { useEffect, useState } from 'react';
import { EXT_MESSAGE } from '@/shared/constant/extension';

const CookieEditor = () => {
  const [cookies, setCookies] = useState<chrome.cookies.Cookie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chrome?.runtime?.sendMessage) {
      setError('Extension runtime is not available in this context');
      return;
    }

    chrome.runtime.sendMessage(
      { type: EXT_MESSAGE.GET_COOKIES },
      (response) => {
        if (chrome.runtime.lastError) {
          setError(chrome.runtime.lastError.message ?? '');
          return;
        }

        if (response?.cookies) {
          setCookies(response.cookies);
          setError(null);
        } else {
          setError(response?.error ?? 'Get cookies failed');
        }
      },
    );
  }, []);

  if (error) {
    return <div className="text-muted-foreground text-sm">{error}</div>;
  }

  return (
    <div>
      {cookies.map((c) => (
        <div key={`${c.name}-${c.domain}-${c.path}`}>
          {c.name} = {c.value} ({c.domain}
          {c.path})
        </div>
      ))}
    </div>
  );
};

export { CookieEditor };
