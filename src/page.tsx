import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routers';
import { ThemeProvider } from './components/themes/theme-provider';

const Page = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider defaultTheme="dark">
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.Suspense>
  );
};

export default Page;
