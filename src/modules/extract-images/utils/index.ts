type ImageKind = 'image' | 'svg' | 'favicon';

type ImageSource = {
  url: string;
  kind: ImageKind;
};

type ImageItem = {
  id: string;
  name: string;
  url: string;
  kind: ImageKind;
};

const IMAGE_KIND_LABEL: Record<ImageKind, string> = {
  image: 'Image',
  svg: 'SVG',
  favicon: 'Favicon',
};

const IMAGE_KIND_BADGE_VARIANT: Record<
  ImageKind,
  'success' | 'warning' | 'secondary'
> = {
  image: 'success',
  svg: 'warning',
  favicon: 'secondary',
};

const addUrl = (
  urls: Map<string, ImageKind>,
  rawUrl: string | null | undefined,
  kind?: ImageKind,
) => {
  if (!rawUrl) {
    return;
  }

  try {
    const url = new URL(rawUrl, document.baseURI).href;
    const nextKind = kind ?? detectImageKind(url);
    const prevKind = urls.get(url);

    // Prefer more specific kinds when the same URL appears from multiple sources.
    if (!prevKind || kindPriority(nextKind) > kindPriority(prevKind)) {
      urls.set(url, nextKind);
    }
  } catch {
    // Ignore invalid URLs.
  }
};

const kindPriority = (kind: ImageKind) => {
  if (kind === 'favicon') return 3;
  if (kind === 'svg') return 2;
  return 1;
};

const detectImageKind = (url: string): ImageKind => {
  const lower = url.toLowerCase();

  if (
    lower.startsWith('data:image/svg+xml') ||
    /\.svg(?:$|\?|#)/i.test(lower)
  ) {
    return 'svg';
  }

  if (
    lower.includes('favicon') ||
    /apple-touch-icon/i.test(lower) ||
    /\.ico(?:$|\?|#)/i.test(lower)
  ) {
    return 'favicon';
  }

  return 'image';
};

const getAllPageImages = (): ImageSource[] => {
  const urls = new Map<string, ImageKind>();

  document.querySelectorAll('img').forEach((img) => {
    addUrl(urls, img.currentSrc);
    addUrl(urls, img.src);

    const dataSrc = img.getAttribute('data-src');
    addUrl(urls, dataSrc);

    const srcset = img.getAttribute('srcset');
    if (srcset) {
      srcset.split(',').forEach((item) => {
        const src = item.trim().split(/\s+/)[0];
        addUrl(urls, src);
      });
    }
  });

  document
    .querySelectorAll(
      'link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]',
    )
    .forEach((link) => {
      addUrl(urls, link.getAttribute('href'), 'favicon');
    });

  document.querySelectorAll('image, use').forEach((node) => {
    addUrl(urls, node.getAttribute('href') ?? node.getAttribute('xlink:href'));
  });

  return [...urls.entries()].map(([url, kind]) => ({ url, kind }));
};

/** @deprecated Prefer getAllPageImages — kept for callers that only need URLs. */
const getAllImageUrls = (): string[] =>
  getAllPageImages().map((item) => item.url);

const getImageName = (url: string, index: number): string => {
  try {
    if (url.startsWith('data:')) {
      const match = /^data:image\/([\w+.-]+);/i.exec(url);
      const ext =
        match?.[1]?.toLowerCase() === 'jpeg' ? 'jpg' : (match?.[1] ?? 'png');
      return `image-${index + 1}.${ext}`;
    }

    if (url.startsWith('blob:')) {
      return `blob-image-${index + 1}`;
    }

    const pathname = new URL(url).pathname;
    const segment = pathname.split('/').filter(Boolean).pop();

    if (!segment) {
      return `image-${index + 1}`;
    }

    return decodeURIComponent(segment);
  } catch {
    return `image-${index + 1}`;
  }
};

const toImageItems = (sources: ImageSource[]): ImageItem[] =>
  sources.map((source, index) => ({
    id: source.url,
    name: getImageName(source.url, index),
    url: source.url,
    kind: source.kind,
  }));

export {
  detectImageKind,
  getAllImageUrls,
  getAllPageImages,
  getImageName,
  IMAGE_KIND_BADGE_VARIANT,
  IMAGE_KIND_LABEL,
  toImageItems,
};
export type { ImageItem, ImageKind, ImageSource };
