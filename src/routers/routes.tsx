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
    { path: PATHS.CURRENCY_CONVERTER, element: <Pages.CurrencyConverterPage /> },
    { path: '*', element: <PageSystem.NotFoundPage /> },
  ] as RouteObject[],
};
