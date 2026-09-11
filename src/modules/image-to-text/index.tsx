import { Camera, ScanText, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonCopy } from '@/components/ui/button-copy';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { useRegionCapture } from '@/shared/hooks';

import { recognizeImage, terminateOcrWorker } from './utils';

type Status = 'idle' | 'capturing' | 'recognizing' | 'done' | 'error';

const ImageToTextPage = () => {
  const { capture, isCapturing } = useRegionCapture();
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      void terminateOcrWorker();
    };
  }, []);

  const runOcr = async (dataUrl: string) => {
    setImageDataUrl(dataUrl);
    setText('');
    setError(null);
    setStatus('recognizing');
    setProgress(0);

    try {
      const result = await recognizeImage(dataUrl, {
        onProgress: ({ progress: value }) => {
          setProgress(Math.round(value * 100));
        },
      });

      setText(result);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed');
      setStatus('error');
    }
  };

  const handleCapture = async () => {
    setError(null);
    setStatus('capturing');

    try {
      const dataUrl = await capture();

      if (!dataUrl) {
        setStatus(imageDataUrl ? 'done' : 'idle');
        return;
      }

      await runOcr(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Capture failed');
      setStatus('error');
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        void runOcr(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setStatus('error');
    };
    reader.readAsDataURL(file);
  };

  const isBusy = isCapturing || status === 'recognizing';

  return (
    <div className="flex flex-col gap-3 px-3 py-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="xs"
          disabled={isBusy}
          isLoading={isCapturing}
          onClick={() => void handleCapture()}
        >
          <Camera />
          Capture
        </Button>

        <Button
          type="button"
          size="xs"
          variant="secondary"
          disabled={isBusy}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload />
          Upload
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {status === 'recognizing' ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner className="size-4" />
          <Typography variant="small" className="text-muted-foreground">
            Recognizing… {progress}%
          </Typography>
        </div>
      ) : null}

      {error ? (
        <Typography variant="small" className="text-destructive">
          {error}
        </Typography>
      ) : null}

      {!imageDataUrl && status === 'idle' ? (
        <Empty className="border border-dashed py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ScanText />
            </EmptyMedia>
            <EmptyTitle>Image to Text</EmptyTitle>
            <EmptyDescription>
              Capture a region on the page or upload an image to extract text.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {imageDataUrl ? (
        <div className="overflow-hidden rounded-md border">
          <img
            src={imageDataUrl}
            alt="Captured region"
            className="max-h-40 w-full object-contain bg-muted/40"
          />
        </div>
      ) : null}

      {imageDataUrl ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-0">
            <Typography variant="small" className="text-muted-foreground">
              Extracted text
            </Typography>
            <ButtonCopy
              content={text}
              size="xs"
              variant="ghost"
              disabled={!text}
            />
          </div>
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              status === 'recognizing' ? 'Reading text…' : 'No text detected'
            }
            className="min-h-40 resize-y"
          />
        </div>
      ) : null}
    </div>
  );
};

export { ImageToTextPage };
