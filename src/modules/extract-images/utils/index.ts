const getAllImageUrls = (): string[] => {
  const urls = new Set<string>();

  document.querySelectorAll('img').forEach((img) => {
    if (img.currentSrc) {
      urls.add(img.currentSrc);
    }

    if (img.src) {
      urls.add(img.src);
    }

    // lazy loading: data-src
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) {
      urls.add(new URL(dataSrc, document.baseURI).href);
    }

    // srcset
    const srcset = img.getAttribute('srcset');

    if (srcset) {
      srcset.split(',').forEach((item) => {
        const src = item.trim().split(/\s+/)[0];

        if (src) {
          urls.add(new URL(src, document.baseURI).href);
        }
      });
    }
  });

  return [...urls];
};

export { getAllImageUrls };
