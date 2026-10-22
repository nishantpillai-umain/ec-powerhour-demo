export type Unit = 'seconds' | 'milliseconds';

export interface ParsedTimestamp {
  date: Date;
  unit: Unit;
}

/** Guess whether a Unix timestamp is in seconds or milliseconds from its magnitude. */
export function detectUnit(value: number): Unit {
  return String(Math.trunc(Math.abs(value))).length > 13 ? 'milliseconds' : 'seconds';
}

export function parseTimestamp(input: string): ParsedTimestamp | null {
  const trimmed = input.trim();
  const value = Number(trimmed);
  if (!trimmed || !Number.isFinite(value)) return null;
  const unit = detectUnit(value);
  const date = new Date(unit === 'seconds' ? value * 1000 : value);
  return Number.isNaN(date.getTime()) ? null : { date, unit };
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
  ['second', 1],
];

export function relativeTime(date: Date, now: Date = new Date()): string {
  const diffSeconds = (date.getTime() - now.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, seconds] of UNITS) {
    if (Math.abs(diffSeconds) >= seconds) return rtf.format(Math.round(diffSeconds / seconds), unit);
  }
  return rtf.format(0, 'second');
}
