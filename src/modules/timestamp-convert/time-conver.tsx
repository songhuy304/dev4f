import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { ButtonGroup } from '@/components/ui/button-group';
import { ArrowRightIcon } from 'lucide-react';
import { TimestampResult, timestampToDate } from '@/shared/utils';
import { MotionView } from '@/components/ui/motion-view';
import { Description, DescriptionItem } from '@/components/ui/description';
import { FieldDescription } from '@/components/ui/field';
import { NumberInput } from '@/components/ui/input-number';

const TimeConverter = () => {
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<TimestampResult | undefined>(undefined);

  const handleConvert = () => {
    if (timestamp === undefined) return;
    const result = timestampToDate(timestamp);
    setResult(result);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full space-y-2">
        <Label htmlFor="timestamp">Timestamp</Label>
        <ButtonGroup className="w-full">
          <NumberInput
            placeholder="Enter timestamp"
            value={timestamp}
            showControls={false}
            className="w-full"
            onValueChange={(value) => setTimestamp(value)}
            min={0}
            max={Number.MAX_SAFE_INTEGER}
          />
          <Button variant="default" onClick={handleConvert}>
            Convert
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </ButtonGroup>
        <FieldDescription>
          Supports Unix timestamps in seconds, milliseconds, microseconds and
          nanoseconds.
        </FieldDescription>
      </div>

      <MotionView show={!!result}>
        <Description>
          <DescriptionItem label="Format">{result?.format}</DescriptionItem>
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

export { TimeConverter };
