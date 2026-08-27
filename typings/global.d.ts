/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="./request.d.ts"/>
/// <reference types="./response.d.ts"/>

declare const __THEME__: {
  tokens: Record<string, object>;
  vars: Record<string, string>;
};

declare const __IS_PRODUCTION__: boolean;

declare const logger: import('@ezuikit/utils-logger').LoggerCls;

interface Window {
  logger: import('@ezuikit/utils-logger').LoggerCls;
}
declare global {
  const window: Window;
}
