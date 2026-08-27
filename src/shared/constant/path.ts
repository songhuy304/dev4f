const TOOLS_PATH = 'tools';
export const TOOLS_ROUTE = {
  BASE: `/${TOOLS_PATH}`,
  DETAIL: (toolId: string) => `/${TOOLS_PATH}/${toolId}`,
};

export const PATHS = {
  QR_CODE: `${TOOLS_PATH}/qr-code`,
};
