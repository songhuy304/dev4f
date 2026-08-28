import { useState, useCallback } from 'react';

interface UsePasteFromClipboardOptions {
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
}

export const usePasteFromClipboard = (
  options?: UsePasteFromClipboardOptions,
) => {
  const [pasted, setPasted] = useState(false);
  const [text, setText] = useState<string>('');

  const paste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setPasted(true);
      options?.onSuccess?.(clipboardText);

      setTimeout(() => {
        setPasted(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
      setPasted(false);
      options?.onError?.(error as Error);
    }
  }, [options]);

  return { pasted, text, paste };
};
