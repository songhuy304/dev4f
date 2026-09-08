import { useEffect, useState } from 'react';

import { requestPageImageUrls } from './utils/request-page-images';

const ExtractImagesPage = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  console.log("🚀 ~ ExtractImagesPage ~ imageUrls:", imageUrls)

  useEffect(() => {
    let cancelled = false;

    void requestPageImageUrls().then((urls) => {
      if (!cancelled) {
        setImageUrls(urls);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <div>{imageUrls.length}</div>;
};

export { ExtractImagesPage };
