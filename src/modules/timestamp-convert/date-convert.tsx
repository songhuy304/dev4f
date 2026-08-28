import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { ArrowRightIcon } from 'lucide-react';
import {
  DateResult,
  dateToTimestamp,
  dayjs,
  getUserTimezone,
} from '@/shared/utils';
import { MotionView } from '@/components/ui/motion-view';
import { Description, DescriptionItem } from '@/components/ui/description';
import { NumberInput } from '@/components/ui/input-number';

const DateConverter = () => {
  const now = dayjs().tz(getUserTimezone());

  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month() + 1);
  const [day, setDay] = useState(now.date());
  const [hour, setHour] = useState(now.hour());
  const [minute, setMinute] = useState(now.minute());
  const [second, setSecond] = useState(now.second());
  const [result, setResult] = useState<DateResult | undefined>(undefined);

  const handleConvert = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;

    try {
      const converted = dateToTimestamp(dateStr);
      setResult(converted);
    } catch {
      setResult(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="grid grid-cols-7 gap-2">
        <div className="space-y-2">
          <Label>Year</Label>
          <NumberInput
            value={year}
            onValueChange={(v) => v !== undefined && setYear(v)}
            min={1970}
            max={2100}
            showControls={false}
          />
        </div>
        <div className="space-y-2">
          <Label>Month</Label>
          <NumberInput
            showControls={false}
            value={month}
            onValueChange={(v) => v !== undefined && setMonth(v)}
            min={1}
            max={12}
          />
        </div>
        <div className="space-y-2">
          <Label>Day</Label>
          <NumberInput
            showControls={false}
            value={day}
            onValueChange={(v) => v !== undefined && setDay(v)}
            min={1}
            max={31}
          />
        </div>
        <div className="space-y-2">
          <Label>Hour</Label>
          <NumberInput
            showControls={false}
            value={hour}
            onValueChange={(v) => v !== undefined && setHour(v)}
            min={0}
            max={23}
          />
        </div>
        <div className="space-y-2">
          <Label>Minutes</Label>
          <NumberInput
            showControls={false}
            value={minute}
            onValueChange={(v) => v !== undefined && setMinute(v)}
            min={0}
            max={59}
          />
        </div>
        <div className="space-y-2">
          <Label>Seconds</Label>
          <NumberInput
            showControls={false}
            value={second}
            onValueChange={(v) => v !== undefined && setSecond(v)}
            min={0}
            max={59}
          />
        </div>

        <Button
          variant="default"
          className="w-fit self-end"
          onClick={handleConvert}
        >
          Convert
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <MotionView show={!!result}>
        <Description>
          <DescriptionItem label="Timestamp">
            {result?.timestamp}
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
