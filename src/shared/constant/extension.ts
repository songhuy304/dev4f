export const EXT_IFRAME_ID = '__admin-dashboard-overlay__';

export const EXT_MESSAGE = {
  TOGGLE_OVERLAY: 'TOGGLE_OVERLAY',
  FRAME_SIZE: 'EXT_FRAME_SIZE',
} as const;

export const EXT_DEFAULT_FRAME_WIDTH = 240;

/** Collapsed rail button only — matches reopen control footprint. */
export const EXT_COLLAPSED_FRAME = {
  width: 33,
  height: 70,
} as const;
