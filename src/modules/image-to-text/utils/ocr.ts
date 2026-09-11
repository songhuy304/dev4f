import { createWorker, type Worker } from 'tesseract.js';

type OcrProgress = {
  status: string;
  progress: number;
};

type RecognizeOptions = {
  onProgress?: (progress: OcrProgress) => void;
};

function getAssetBase() {
  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    return chrome.runtime.getURL('tesseract/');
  }

  return '/tesseract/';
}

let workerPromise: Promise<Worker> | null = null;
let progressHandler: ((progress: OcrProgress) => void) | undefined;

async function getWorker() {
  if (!workerPromise) {
    const base = getAssetBase();

    workerPromise = createWorker('eng+vie', 1, {
      workerPath: `${base}worker.min.js`,
      corePath: base,
      workerBlobURL: false,
      logger: (message) => {
        progressHandler?.({
          status: message.status,
          progress: message.progress,
        });
      },
    });
  }

  return workerPromise;
}

async function recognizeImage(
  image: string,
  options: RecognizeOptions = {},
): Promise<string> {
  progressHandler = options.onProgress;

  try {
    const worker = await getWorker();
    const {
      data: { text },
    } = await worker.recognize(image);

    return text.trim();
  } finally {
    progressHandler = undefined;
  }
}

async function terminateOcrWorker() {
  if (!workerPromise) {
    return;
  }

  const worker = await workerPromise;
  workerPromise = null;
  await worker.terminate();
}

export { recognizeImage, terminateOcrWorker };
export type { OcrProgress };
