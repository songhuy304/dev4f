import { useState } from 'react';

type DownloadType = 'txt' | 'json' | 'md';

const MIME_TYPES: Record<DownloadType, string> = {
  txt: 'text/plain;charset=utf-8',
  json: 'application/json;charset=utf-8',
  md: 'text/markdown;charset=utf-8',
};

const triggerBlobDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const useDownload = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadBlob = (blob: Blob, fileName: string) => {
    setIsDownloading(true);
    setError(null);

    try {
      triggerBlobDownload(blob, fileName);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('Could not download file'),
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsync = async (
    getFile: () => Promise<{ blob: Blob; fileName: string }>,
  ) => {
    setIsDownloading(true);
    setError(null);

    try {
      const { blob, fileName } = await getFile();
      triggerBlobDownload(blob, fileName);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('Could not download file'),
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const download = (content: string, fileName: string, type: DownloadType) => {
    const blob = new Blob([content], {
      type: MIME_TYPES[type],
    });

    const name = fileName.endsWith(`.${type}`)
      ? fileName
      : `${fileName}.${type}`;

    downloadBlob(blob, name);
  };

  const downloadJson = (data: unknown, fileName: string) => {
    const content = JSON.stringify(data, null, 2);

    download(content, fileName, 'json');
  };

  const downloadTxt = (content: string, fileName: string) => {
    download(content, fileName, 'txt');
  };

  const downloadMarkdown = (content: string, fileName: string) => {
    download(content, fileName, 'md');
  };

  return {
    error,
    isDownloading,
    download,
    downloadBlob,
    downloadAsync,
    downloadJson,
    downloadTxt,
    downloadMarkdown,
  };
};
