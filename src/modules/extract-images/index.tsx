import { ImageIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { useDownload } from '@/shared/hooks/use-download';

import { ExtractImagesHeader, ImageCard } from './components';
import { toImageItems, type ImageItem } from './utils';
import { buildImagesZipBlob } from './utils/download-images-zip';
import { requestPageImages } from './utils/request-page-images';

const ExtractImagesPage = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { downloadAsync, isDownloading } = useDownload();

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    void requestPageImages().then((sources) => {
      if (cancelled) {
        return;
      }

      setImages(toImageItems(sources));
      setSelectedIds(new Set());
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const allSelected =
    images.length > 0 && selectedIds.size === images.length;
  const partiallySelected =
    selectedIds.size > 0 && selectedIds.size < images.length;

  const selectedImages = useMemo(
    () => images.filter((item) => selectedIds.has(item.id)),
    [images, selectedIds],
  );

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(images.map((item) => item.id)));
      return;
    }

    setSelectedIds(new Set());
  };

  const handleSelectedChange = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const handleDownloadZip = () => {
    if (selectedImages.length === 0) {
      return;
    }

    void downloadAsync(async () => ({
      blob: await buildImagesZipBlob(selectedImages),
      fileName: 'images.zip',
    }));
  };

  return (
    <div className="flex flex-col gap-3 px-3 py-2">
      <ExtractImagesHeader
        total={images.length}
        selectedCount={selectedIds.size}
        allSelected={allSelected}
        partiallySelected={partiallySelected}
        isDownloading={isDownloading}
        onSelectAllChange={handleSelectAllChange}
        onDownloadZip={handleDownloadZip}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-5" />
        </div>
      ) : images.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>No images found</EmptyTitle>
            <EmptyDescription>
              Open this tool on a page that contains images.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {images.map((item) => (
            <ImageCard
              key={item.id}
              item={item}
              selected={selectedIds.has(item.id)}
              onSelectedChange={(selected) =>
                handleSelectedChange(item.id, selected)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { ExtractImagesPage };
