import { Typography } from '@/components/ui/typography';
import { dayjs, getUserTimezone } from '@/shared/utils';
import { useEffect, useState } from 'react';
import { TimeConverter } from './time-conver';
import { DateConverter } from './date-convert';

const TimestampConvert = () => {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timestamp = now.unix();

  const formattedDate = now.tz(getUserTimezone()).format('YYYY-MM-DD HH:mm:ss');

  return (
    <div className="flex flex-col gap-4 pt-8 pb-4 px-4">
      <div className="space-y-1 flex flex-col items-center justify-center">
        <Typography variant="h1" className="font-medium">
          {timestamp}
        </Typography>
        <Typography>{formattedDate}</Typography>
      </div>

      <TimeConverter />
      <DateConverter />
    </div>
  );
};

export { TimestampConvert };
