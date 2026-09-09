import JSZip from 'jszip';

import type { ImageItem } from './index';

const uniqueFileName = (name: string, used: Map<string, number>) => {
  const count = used.get(name) ?? 0;
  used.set(name, count + 1);

  if (count === 0) {
    return name;
  }

  const dot = name.lastIndexOf('.');
  if (dot <= 0) {
    return `${name}-${count + 1}`;
  }

  return `${name.slice(0, dot)}-${count + 1}${name.slice(dot)}`;
};

const fetchImageBlob = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return response.blob();
};

const buildImagesZipBlob = async (items: ImageItem[]) => {
  const zip = new JSZip();
  const usedNames = new Map<string, number>();

  await Promise.all(
    items.map(async (item) => {
      try {
        const blob = await fetchImageBlob(item.url);
        zip.file(uniqueFileName(item.name, usedNames), blob);
      } catch {
        // Skip images that fail to fetch (CORS / network).
      }
    }),
  );

  return zip.generateAsync({ type: 'blob' });
};

export { buildImagesZipBlob, fetchImageBlob };
