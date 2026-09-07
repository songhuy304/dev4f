import { useMemo, useState } from 'react';

interface FilterProps<T> {
  items: T[];
  filterFn: (item: T, q: string) => boolean | T;
  initialKeyword?: string;
}

const useFilter = <T>({
  items,
  filterFn,
  initialKeyword = '',
}: FilterProps<T>) => {
  const [keyword, setKeyword] = useState(initialKeyword);

  const data = useMemo(() => {
    const query = keyword.trim();

    return items.filter((item) => filterFn(item, query));
  }, [items, keyword, filterFn]);

  return { data, keyword, setKeyword };
};

export { useFilter };
