import { DateTimeInput } from '@/components/datetime-input';
import { DateTimePicker } from '@/components/datetime-picker';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Description, DescriptionItem } from '@/components/ui/description';
import { Label } from '@/components/ui/label';
import { MotionView } from '@/components/ui/motion-view';
import {
  DateResult,
  dateToTimestamp,
  dayjs,
  getUserTimezone,
} from '@/shared/utils';
import { ArrowRightIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

type InputTimezone = 'local' | 'utc';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

const DateConverter = () => {
  const [inputTimezone, setInputTimezone] = useState<InputTimezone>('local');
  const [date, setDate] = useState<Date | undefined>(() => new Date());
  const [result, setResult] = useState<DateResult | undefined>(undefined);

  const timezone = useMemo(
    () => (inputTimezone === 'utc' ? 'UTC' : getUserTimezone()),
    [inputTimezone],
  );

  const handleTimezoneChange = (next: InputTimezone) => {
    if (next === inputTimezone) return;

    if (date) {
      const prevTz = inputTimezone === 'utc' ? 'UTC' : getUserTimezone();
      const nextTz = next === 'utc' ? 'UTC' : getUserTimezone();
      const wall = dayjs(date).tz(prevTz).format('YYYY-MM-DD HH:mm:ss');
      setDate(dayjs.tz(wall, nextTz).toDate());
    }

    setInputTimezone(next);
  };

  const handleConvert = () => {
    if (!date) {
      setResult(undefined);
      return;
    }

    try {
      setResult(dateToTimestamp(date, timezone));
    } catch {
      setResult(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="space-y-2">
        <Label>Input timezone</Label>
        <ButtonGroup>
          <Button
            type="button"
            variant={inputTimezone === 'local' ? 'default' : 'outline'}
            onClick={() => handleTimezoneChange('local')}
          >
            Local
          </Button>
          <Button
            type="button"
            variant={inputTimezone === 'utc' ? 'default' : 'outline'}
            onClick={() => handleTimezoneChange('utc')}
          >
            UTC
          </Button>
        </ButtonGroup>
      </div>

      <div className="space-y-2">
        <Label>Date & time</Label>
        <div className="flex w-full items-start gap-2">
          <div className="min-w-0 flex-1">
            <DateTimePicker
              value={date}
              onChange={setDate}
              timezone={timezone}
              timePicker={{ hour: true, minute: true, second: true }}
              renderTrigger={({ open, value, setOpen }) => (
                <DateTimeInput
                  value={value}
                  onChange={(next) => !open && setDate(next)}
                  format={DATE_FORMAT}
                  timezone={timezone}
                  disabled={open}
                  onCalendarClick={() => setOpen(!open)}
                  className="h-9 w-full"
                />
              )}
            />
          </div>
          <Button variant="default" onClick={handleConvert} disabled={!date}>
            Convert
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <MotionView show={!!result}>
        <Description>
          <DescriptionItem
            label="Timestamp"
            copy={String(result?.timestamp ?? '')}
          >
            {result?.timestamp}
          </DescriptionItem>
          <DescriptionItem
            label="Timestamp in ms"
            copy={String(result?.milliseconds ?? '')}
          >
            {result?.milliseconds}
          </DescriptionItem>
          <DescriptionItem label="ISO">{result?.iso}</DescriptionItem>
          <DescriptionItem label="GMT">{result?.gmt}</DescriptionItem>
          <DescriptionItem
            label="Time Zone"
            tooltip={`${result?.local} / ${result?.timezone}`}
          >
            {result?.local} / {result?.timezone}
          </DescriptionItem>
          <DescriptionItem label="Relative">{result?.relative}</DescriptionItem>
        </Description>
      </MotionView>
    </div>
  );
};

export { DateConverter };
