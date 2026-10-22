import { describe, expect, it } from 'vitest';
import { detectUnit, parseTimestamp, relativeTime } from './logic';

describe('detectUnit', () => {
  it('treats 10-digit values as seconds', () => {
    expect(detectUnit(1_700_000_000)).toBe('seconds');
  });
});

describe('parseTimestamp', () => {
  it('parses seconds', () => {
    expect(parseTimestamp('1700000000')?.date.toISOString()).toBe('2023-11-14T22:13:20.000Z');
  });

  it('ignores surrounding whitespace', () => {
    expect(parseTimestamp('  0 ')?.date.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });

  it('returns null for non-numbers', () => {
    expect(parseTimestamp('yesterday')).toBeNull();
    expect(parseTimestamp('')).toBeNull();
  });
});

describe('relativeTime', () => {
  const now = new Date('2024-01-01T12:00:00Z');

  it('describes the past', () => {
    expect(relativeTime(new Date('2024-01-01T09:00:00Z'), now)).toBe('3 hours ago');
  });

  it('describes the future', () => {
    expect(relativeTime(new Date('2024-01-03T12:00:00Z'), now)).toBe('in 2 days');
  });

  it('handles now', () => {
    expect(relativeTime(now, now)).toBe('now');
  });
});
