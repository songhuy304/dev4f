import * as React from 'react';

const subscribers = new Map<string, Set<(value: unknown) => void>>();

function subscribe(key: string, listener: (value: unknown) => void) {
  let keySubscribers = subscribers.get(key);

  if (!keySubscribers) {
    keySubscribers = new Set();
    subscribers.set(key, keySubscribers);
  }

  keySubscribers.add(listener);

  return () => {
    keySubscribers.delete(listener);
    if (keySubscribers.size === 0) {
      subscribers.delete(key);
    }
  };
}

function notify(key: string, value: unknown) {
  subscribers.get(key)?.forEach((listener) => {
    listener(value);
  });
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const getInitialValue = React.useCallback(() => {
    return initialValue instanceof Function ? initialValue() : initialValue;
  }, [initialValue]);

  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return getInitialValue();
    }

    try {
      const item = window.localStorage.getItem(key);

      return item !== null ? JSON.parse(item) : getInitialValue();
    } catch {
      return getInitialValue();
    }
  });

  React.useEffect(() => {
    return subscribe(key, (nextValue) => {
      setValue(nextValue as T);
    });
  }, [key]);

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) {
        return;
      }

      try {
        setValue(
          event.newValue !== null
            ? (JSON.parse(event.newValue) as T)
            : getInitialValue(),
        );
      } catch {
        setValue(getInitialValue());
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, getInitialValue]);

  const setStoredValue = React.useCallback(
    (value: React.SetStateAction<T>) => {
      setValue((currentValue) => {
        const nextValue =
          value instanceof Function ? value(currentValue) : value;

        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Ignore localStorage errors
        }

        notify(key, nextValue);
        return nextValue;
      });
    },
    [key],
  );

  const remove = React.useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore localStorage errors
    }

    const nextValue = getInitialValue();
    setValue(nextValue);
    notify(key, nextValue);
  }, [key, getInitialValue]);

  return [value, setStoredValue, remove] as const;
}
