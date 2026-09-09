const TOOLS_PATH = 'tools';
export const TOOLS_ROUTE = {
  BASE: `/${TOOLS_PATH}`,
  DETAIL: (toolId: string) => `/${TOOLS_PATH}/${toolId}`,
};

export const PATHS = {
  QR_CODE: `${TOOLS_PATH}/qr-code`,
  SETTINGS: `${TOOLS_PATH}/settings`,
  RESPONSIVE_VIEWER: `${TOOLS_PATH}/responsive-viewer`,
  STORAGE_MANAGER: `${TOOLS_PATH}/storage-manager`,
  EXTRACT_IMAGES: `${TOOLS_PATH}/extract-images`,
  FORMAT_JSON: `${TOOLS_PATH}/format-json`,
  TEXT_COMPARE: `${TOOLS_PATH}/text-compare`,
  COLOR_PICKER: `${TOOLS_PATH}/color-picker`,
  SCREENSHOT: `${TOOLS_PATH}/screenshot`,
  LINK_SHORTENER: `${TOOLS_PATH}/link-shortener`,
  IMAGE_TO_TEXT: `${TOOLS_PATH}/image-to-text`,
  CURRENCY_CONVERTER: `${TOOLS_PATH}/currency-converter`,
  STICKY_NOTES: `${TOOLS_PATH}/sticky-notes`,
  JWT_DECODER: `${TOOLS_PATH}/jwt-decoder`,
  TIMESTAMP: `${TOOLS_PATH}/timestamp`,
  PAGE_SPEED: `${TOOLS_PATH}/page-speed`,
  MARKDOWN_PREVIEW: `${TOOLS_PATH}/markdown-preview`,
};
