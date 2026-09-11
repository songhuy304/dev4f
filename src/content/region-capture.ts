type RegionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type RegionCaptureOptions = {
  screenshotDataUrl: string;
  onComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
};

const OVERLAY_ID = '__devkit-region-capture__';
const MIN_SIZE = 8;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load screenshot'));
    image.src = src;
  });
}

async function cropRegion(
  screenshotDataUrl: string,
  rect: RegionRect,
): Promise<string> {
  const image = await loadImage(screenshotDataUrl);
  const scaleX = image.naturalWidth / window.innerWidth;
  const scaleY = image.naturalHeight / window.innerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(rect.width * scaleX));
  canvas.height = Math.max(1, Math.round(rect.height * scaleY));

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas not supported');
  }

  ctx.drawImage(
    image,
    Math.round(rect.x * scaleX),
    Math.round(rect.y * scaleY),
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL('image/png');
}

function normalizeRect(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): RegionRect {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return { x, y, width, height };
}

function removeExistingOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
}

export function startRegionCapture({
  screenshotDataUrl,
  onComplete,
  onCancel,
}: RegionCaptureOptions) {
  removeExistingOverlay();

  const root = document.createElement('div');
  root.id = OVERLAY_ID;
  Object.assign(root.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '2147483647',
    cursor: 'crosshair',
    userSelect: 'none',
  });

  const backdrop = document.createElement('div');
  Object.assign(backdrop.style, {
    position: 'absolute',
    inset: '0',
    backgroundImage: `url("${screenshotDataUrl}")`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  });

  const dim = document.createElement('div');
  Object.assign(dim.style, {
    position: 'absolute',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.45)',
  });

  const selection = document.createElement('div');
  Object.assign(selection.style, {
    position: 'absolute',
    border: '2px solid #38bdf8',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
    background: 'transparent',
    display: 'none',
    pointerEvents: 'none',
  });

  const hint = document.createElement('div');
  hint.textContent = 'Drag to select text region · Esc to cancel';
  Object.assign(hint.style, {
    position: 'fixed',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '1',
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.9)',
    color: '#f8fafc',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: '13px',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  });

  root.append(backdrop, dim, selection, hint);
  document.documentElement.appendChild(root);

  let startX = 0;
  let startY = 0;
  let dragging = false;
  let finished = false;

  const cleanup = () => {
    window.removeEventListener('keydown', onKeyDown, true);
    root.remove();
  };

  const finishCancel = () => {
    if (finished) return;
    finished = true;
    cleanup();
    onCancel();
  };

  const finishComplete = async (rect: RegionRect) => {
    if (finished) return;
    finished = true;
    cleanup();

    try {
      const cropped = await cropRegion(screenshotDataUrl, rect);
      onComplete(cropped);
    } catch {
      onCancel();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      finishCancel();
    }
  };

  root.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    dim.style.display = 'none';
    selection.style.display = 'block';
    Object.assign(selection.style, {
      left: `${startX}px`,
      top: `${startY}px`,
      width: '0px',
      height: '0px',
    });
  });

  root.addEventListener('mousemove', (event) => {
    if (!dragging) return;
    const rect = normalizeRect(startX, startY, event.clientX, event.clientY);
    Object.assign(selection.style, {
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  });

  root.addEventListener('mouseup', (event) => {
    if (!dragging || event.button !== 0) return;
    dragging = false;
    const rect = normalizeRect(startX, startY, event.clientX, event.clientY);

    if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
      finishCancel();
      return;
    }

    void finishComplete(rect);
  });

  window.addEventListener('keydown', onKeyDown, true);
}
