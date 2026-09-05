export interface FormatNumberOptions {
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  prefix?: string;
  suffix?: string;
}

export function parseNumber(
  raw: string,
  {
    thousandSeparator = ',',
    decimalSeparator = '.',
    prefix = '',
    suffix = '',
  }: FormatNumberOptions = {},
): number | undefined {
  if (!raw) return undefined;

  let str = raw;

  if (prefix && str.startsWith(prefix)) str = str.slice(prefix.length);
  if (suffix && str.endsWith(suffix)) str = str.slice(0, -suffix.length);

  if (thousandSeparator) {
    str = str.split(thousandSeparator).join('');
  }
  if (decimalSeparator !== '.') {
    str = str.replace(decimalSeparator, '.');
  }

  // chỉ giữ số, dấu trừ ở đầu, và 1 dấu chấm
  str = str.replace(/[^0-9.-]/g, '');

  if (str === '' || str === '-') return undefined;

  const num = Number(str);
  return Number.isNaN(num) ? undefined : num;
}

/**
 * Format number cho input / tùy chỉnh.
 * Mặc định không có thousand separator.
 */
export function formatNumber(
  value: number | undefined | null,
  {
    thousandSeparator = '',
    decimalSeparator = '.',
    decimalScale = 0,
    fixedDecimalScale = false,
    prefix = '',
    suffix = '',
  }: FormatNumberOptions = {},
): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '';

  const isNegative = value < 0;
  const abs = Math.abs(value);

  let [intPart, decPart = ''] = abs.toFixed(20).split('.');
  decPart = decPart.slice(0, decimalScale);

  if (fixedDecimalScale) {
    decPart = decPart.padEnd(decimalScale, '0');
  } else {
    decPart = decPart.replace(/0+$/, '');
  }

  if (thousandSeparator) {
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }

  let result = intPart;
  if (decimalScale > 0 && decPart.length > 0) {
    result += decimalSeparator + decPart;
  }
  if (isNegative && abs !== 0) result = '-' + result;

  return `${prefix}${result}${suffix}`;
}

/**
 * Format number cho view hiển thị thông thường (có thousand separator).
 * Ví dụ: 1234567.5 → "1,234,567.5"
 */
export function formatNumberView(
  value: number | undefined | null,
  options: FormatNumberOptions = {},
): string {
  return formatNumber(value, {
    thousandSeparator: ',',
    decimalScale: 2,
    ...options,
  });
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
