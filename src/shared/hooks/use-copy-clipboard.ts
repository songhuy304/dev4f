import { useCallback, useState } from 'react';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

type CopyImageFn = (source: Blob | string) => Promise<boolean>;

const blobToPngBlob = async (blob: Blob): Promise<Blob> => {
  if (blob.type === 'image/png') {
    return blob;
  }

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Canvas not supported');
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const pngBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });

  if (!pngBlob) {
    throw new Error('Failed to encode PNG');
  }

  return pngBlob;
};

export function useCopyToClipboard(): [CopiedValue, CopyFn, CopyImageFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const markCopied = (value: string) => {
    setCopiedText(value);

    window.setTimeout(() => {
      setCopiedText((current) => (current === value ? null : current));
    }, 2000);
  };

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      markCopied(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  const copyImage: CopyImageFn = useCallback(async (source) => {
    if (!navigator?.clipboard?.write || typeof ClipboardItem === 'undefined') {
      console.warn('Image clipboard not supported');
      return false;
    }

    try {
      const blob =
        typeof source === 'string'
          ? await (await fetch(source)).blob()
          : source;
      const pngBlob = await blobToPngBlob(blob);
      const key = typeof source === 'string' ? source : 'image';

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob }),
      ]);

      markCopied(key);
      return true;
    } catch (error) {
      console.warn('Copy image failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy, copyImage];
}
