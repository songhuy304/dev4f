import { AppLayout } from '@/components/app-layout';
import { PATHS } from '@/shared/constant';
import { RouteObject } from 'react-router-dom';

import * as Pages from '@/modules';

export const routes: RouteObject = {
  path: '/',
  element: <AppLayout />,
  children: [
    { index: true, element: null },
    { path: PATHS.QR_CODE, element: <Pages.QrCodePage /> },
  ],
};
