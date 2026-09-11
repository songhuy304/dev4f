import { AppLayout } from '@/components/app-layout';
import { PATHS } from '@/shared/constant';
import { RouteObject } from 'react-router-dom';

import * as PageSystem from '@/components/pages';
import * as Pages from '@/modules';

export const routes: RouteObject = {
  path: '/',
  element: <AppLayout />,
  children: [
    { index: true, element: null },
    { path: PATHS.QR_CODE, element: <Pages.QrCodePage /> },
    { path: PATHS.LINK_SHORTENER, element: <Pages.LinkShorterPage /> },
    { path: PATHS.TIMESTAMP, element: <Pages.TimestampConvert /> },
    { path: PATHS.MARKDOWN_PREVIEW, element: <Pages.MarkdownPage /> },
    {
      path: PATHS.CURRENCY_CONVERTER,
      element: <Pages.CurrencyConverterPage />,
    },
    { path: PATHS.STORAGE_MANAGER, element: <Pages.BrowserStoragePage /> },
    { path: PATHS.EXTRACT_IMAGES, element: <Pages.ExtractImagesPage /> },
    { path: PATHS.IMAGE_TO_TEXT, element: <Pages.ImageToTextPage /> },
    { path: PATHS.SETTINGS, element: <Pages.SettingsPage /> },
    { path: '*', element: <PageSystem.NotFoundPage /> },
  ] as RouteObject[],
};
