import { describe, expect, it } from 'vitest';
import { findMatches, formatMatches, segmentText, testRegex } from './logic';

describe('testRegex', () => {
  it('finds all matches with the g flag', () => {
    const result = testRegex('\\d+', 'g', 'a1 b22 c333');
    expect(result.ok && result.matches.map((m) => [m.text, m.index])).toEqual([
      ['1', 1],
      ['22', 4],
      ['333', 8],
    ]);
  });

  it('returns only the first match without g', () => {
    const result = testRegex('\\d+', '', 'a1 b22');
    expect(result.ok && result.matches.map((m) => m.text)).toEqual(['1']);
  });

  it('applies the i, m and s flags', () => {
    expect(testRegex('abc', 'i', 'ABC')).toMatchObject({ ok: true, matches: [{ text: 'ABC' }] });
    const multi = testRegex('^\\w', 'gm', 'one\ntwo');
    expect(multi.ok && multi.matches.map((m) => m.text)).toEqual(['o', 't']);
    const dotAll = testRegex('a.b', 's', 'a\nb');
    expect(dotAll.ok && dotAll.matches).toHaveLength(1);
  });

  it('reports numbered and named capture groups', () => {
    const result = testRegex('(?<year>\\d{4})-(\\d{2})(x)?', 'g', 'on 2024-05');
    expect(result.ok && result.matches[0]).toEqual({
      index: 3,
      end: 10,
      text: '2024-05',
      groups: ['2024', '05', undefined],
      namedGroups: { year: '2024' },
    });
  });

  it('returns an error instead of throwing on an invalid pattern', () => {
    const result = testRegex('(unclosed', 'g', 'text');
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/Invalid regular expression/);
  });

  it('rejects unsupported flags', () => {
    expect(testRegex('a', 'gy', 'a')).toEqual({ ok: false, error: 'Unsupported flag: y' });
  });

  it('matches nothing in empty text without error', () => {
    expect(testRegex('a', 'g', '')).toEqual({ ok: true, matches: [], truncated: false });
  });
});

describe('findMatches', () => {
  it('terminates on zero-length matches', () => {
    const { matches } = findMatches(/x*/g, 'ab');
    expect(matches.map((m) => m.index)).toEqual([0, 1, 2]);
  });

  it('steps over whole surrogate pairs in unicode mode', () => {
    const { matches } = findMatches(/(?:)/gu, '😀a');
    expect(matches.map((m) => m.index)).toEqual([0, 2, 3]);
  });

  it('does not mutate the caller regex lastIndex', () => {
    const re = /a/g;
    findMatches(re, 'aaa');
    expect(re.lastIndex).toBe(0);
  });

  it('caps the number of matches', () => {
    expect(findMatches(/a/g, 'aaaa', 2)).toMatchObject({ truncated: true, matches: [{}, {}] });
    expect(findMatches(/a/g, 'aa', 2).truncated).toBe(false);
  });
});

describe('segmentText', () => {
  it('splits text into matched and plain runs', () => {
    const { matches } = findMatches(/\d+/g, 'a12b3');
    expect(segmentText('a12b3', matches)).toEqual([
      { text: 'a', match: false },
      { text: '12', match: true },
      { text: 'b', match: false },
      { text: '3', match: true },
    ]);
  });

  it('ignores zero-length matches', () => {
    const { matches } = findMatches(/x*/g, 'ab');
    expect(segmentText('ab', matches)).toEqual([{ text: 'ab', match: false }]);
  });
});

describe('formatMatches', () => {
  it('serialises matches as JSON', () => {
    const { matches } = findMatches(/b/g, 'ab');
    expect(JSON.parse(formatMatches(matches))).toEqual([{ index: 1, end: 2, text: 'b', groups: [], namedGroups: {} }]);
  });
});
