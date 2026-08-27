import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { setSubHeaders, type BreadcrumbItemType } from '@/store';
import { APP_NAME } from '@/shared/constant';

type UsePageHeaderParams = {
  title: string;
  breadcrumb?: BreadcrumbItemType[];
};

const usePageHeader = ({ title, breadcrumb }: UsePageHeaderParams) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = `${title} - ${APP_NAME || 'Ups'}`;

    if (breadcrumb) {
      dispatch(setSubHeaders(breadcrumb));
    }

    return () => {
      dispatch(setSubHeaders([]));
    };
  }, [title, JSON.stringify(breadcrumb)]);
};

export { usePageHeader };
