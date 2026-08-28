import { useEffect } from 'react';

type KeyboardHandlers = Record<string, (event: KeyboardEvent) => void>;

export function useKeyboard(handlers: KeyboardHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const handler = handlers[event.key];

      if (handler) {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
}
