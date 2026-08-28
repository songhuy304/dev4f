import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export type TimestampUnit =
  | 'seconds'
  | 'milliseconds'
  | 'microseconds'
  | 'nanoseconds';

export interface TimestampResult {
  timestamp: number;
  unit: TimestampUnit;
  format: string;
  seconds: number;
  milliseconds: number;
  timezone: string;
  gmt: string;
  local: string;
  relative: string;
  iso: string;
}

export interface DateResult {
  date: dayjs.Dayjs;

  timestamp: number;
  seconds: number;
  milliseconds: number;

  timezone: string;
  format: string;

  gmt: string;
  local: string;
  relative: string;

  iso: string;
}

export const getUserTimezone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

const TIMESTAMP_UNIT_LABELS: Record<TimestampUnit, string> = {
  seconds: 'Seconds',
  milliseconds: 'Milliseconds',
  microseconds: 'Microseconds',
  nanoseconds: 'Nanoseconds',
};

export function formatTimestampUnit(unit: TimestampUnit): string {
  return TIMESTAMP_UNIT_LABELS[unit];
}

export function detectTimestampUnit(
  timestamp: number | string,
): TimestampUnit {
  const raw = String(timestamp).trim();

  if (!raw || Number.isNaN(Number(raw))) {
    throw new Error('Invalid timestamp');
  }

  const integerPart = raw.split('.')[0].replace('-', '');
  const length = integerPart.length;

  if (length <= 10) return 'seconds';
  if (length <= 13) return 'milliseconds';
  if (length <= 16) return 'microseconds';

  return 'nanoseconds';
}

export function timestampToMilliseconds(
  timestamp: number | string,
  unit?: TimestampUnit,
): number {
  const value = Number(timestamp);

  if (!Number.isFinite(value)) {
    throw new Error('Invalid timestamp');
  }

  const resolvedUnit = unit ?? detectTimestampUnit(timestamp);

  switch (resolvedUnit) {
    case 'seconds':
      return value * 1000;
    case 'milliseconds':
      return value;
    case 'microseconds':
      return value / 1000;
    case 'nanoseconds':
      return value / 1_000_000;
  }
}

export function getGMTOffset(
  date: Date | dayjs.Dayjs,
  timezone: string,
): string {
  const value = dayjs.isDayjs(date) ? date : dayjs(date);

  const offset = value.tz(timezone).utcOffset();

  const sign = offset >= 0 ? '+' : '-';
  const absoluteOffset = Math.abs(offset);

  const hours = Math.floor(absoluteOffset / 60)
    .toString()
    .padStart(2, '0');

  const minutes = (absoluteOffset % 60).toString().padStart(2, '0');

  return `GMT${sign}${hours}${minutes}`;
}

export function getTimezoneName(
  timezone: string,
  date: Date | dayjs.Dayjs = new Date(),
): string {
  const value = dayjs.isDayjs(date) ? date.toDate() : date;

  return (
    new Intl.DateTimeFormat('vi-VN', {
      timeZone: timezone,
      timeZoneName: 'long',
    })
      .formatToParts(value)
      .find((part) => part.type === 'timeZoneName')?.value ?? timezone
  );
}

export function formatGMT(date: Date | dayjs.Dayjs): string {
  const value = dayjs.isDayjs(date) ? date.utc() : dayjs(date).utc();

  return value.format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

export function formatUserTimezone(
  date: Date | dayjs.Dayjs,
  timezone = getUserTimezone(),
): string {
  const value = dayjs.isDayjs(date)
    ? date.tz(timezone)
    : dayjs(date).tz(timezone);

  const gmt = getGMTOffset(value, timezone);
  const timezoneName = getTimezoneName(timezone, value);

  return `${value.format('ddd MMM DD YYYY HH:mm:ss')} ${gmt} (${timezoneName})`;
}

export function formatRelative(date: Date | dayjs.Dayjs): string {
  return dayjs.isDayjs(date) ? date.fromNow() : dayjs(date).fromNow();
}

export function formatISO(date: Date | dayjs.Dayjs): string {
  return dayjs.isDayjs(date) ? date.toISOString() : dayjs(date).toISOString();
}

export function formatDate(
  date: Date | dayjs.Dayjs,
  format = 'YYYY-MM-DD HH:mm:ss',
  timezone = getUserTimezone(),
): string {
  const value = dayjs.isDayjs(date)
    ? date.tz(timezone)
    : dayjs(date).tz(timezone);

  return value.format(format);
}

export function timestampToDayjs(
  timestamp: number | string,
  unit?: TimestampUnit,
): dayjs.Dayjs {
  const resolvedUnit = unit ?? detectTimestampUnit(timestamp);
  const milliseconds = timestampToMilliseconds(timestamp, resolvedUnit);

  return dayjs(milliseconds);
}

export function timestampToDate(
  timestamp: number | string,
  timezone = getUserTimezone(),
): TimestampResult {
  const unit = detectTimestampUnit(timestamp);
  const date = timestampToDayjs(timestamp, unit);

  if (!date.isValid()) {
    throw new Error('Invalid timestamp');
  }

  const milliseconds = date.valueOf();
  const seconds = Math.floor(milliseconds / 1000);

  return {
    timestamp: Number(timestamp),
    unit,
    format: formatTimestampUnit(unit),

    seconds,
    milliseconds,
    timezone,

    gmt: formatGMT(date),
    local: formatUserTimezone(date, timezone),
    relative: formatRelative(date),

    iso: formatISO(date),
  };
}

export function parseDate(
  date: string | Date,
  timezone = getUserTimezone(),
): dayjs.Dayjs {
  const value = date instanceof Date ? dayjs(date) : dayjs.tz(date, timezone);

  if (!value.isValid()) {
    throw new Error('Invalid date');
  }

  return value;
}

/**
 * Convert date -> timestamp information.
 */
export function dateToTimestamp(
  date: string | Date,
  timezone = getUserTimezone(),
): DateResult {
  const value = parseDate(date, timezone);

  const milliseconds = value.valueOf();
  const seconds = Math.floor(milliseconds / 1000);

  return {
    date: value,

    timestamp: seconds,

    seconds,
    milliseconds,

    timezone,
    format: formatDate(value, 'YYYY-MM-DD HH:mm:ss', timezone),

    gmt: formatGMT(value),
    local: formatUserTimezone(value, timezone),
    relative: formatRelative(value),

    iso: formatISO(value),
  };
}

/**
 * Convert timestamp directly to seconds.
 */
export function toSeconds(
  timestamp: number | string,
  unit?: TimestampUnit,
): number {
  return Math.floor(timestampToMilliseconds(timestamp, unit) / 1000);
}

/**
 * Convert timestamp directly to milliseconds.
 */
export function toMilliseconds(
  timestamp: number | string,
  unit?: TimestampUnit,
): number {
  return timestampToMilliseconds(timestamp, unit);
}

/**
 * Get current Unix timestamp.
 */
export function nowTimestamp(unit: TimestampUnit = 'seconds'): number {
  const milliseconds = Date.now();

  return unit === 'seconds' ? Math.floor(milliseconds / 1000) : milliseconds;
}

export { dayjs };
