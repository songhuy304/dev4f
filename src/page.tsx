import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routers';

const Page = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default Page;
