import { describe, expect, it } from 'vitest';
import { formatJson, minifyJson } from './logic';

describe('formatJson', () => {
  it('pretty-prints with the given indent', () => {
    expect(formatJson('{"a":1}', { indent: 2, sortKeys: false })).toBe('{\n  "a": 1\n}');
  });

  it('supports tab indentation', () => {
    expect(formatJson('{"a":1}', { indent: '\t', sortKeys: false })).toBe('{\n\t"a": 1\n}');
  });

  it('sorts keys when asked', () => {
    expect(formatJson('{"b":1,"a":2}', { indent: 0, sortKeys: true })).toBe('{"a":2,"b":1}');
  });

  it('throws on invalid JSON', () => {
    expect(() => formatJson('{nope}', { indent: 2, sortKeys: false })).toThrow();
  });
});

describe('minifyJson', () => {
  it('strips whitespace', () => {
    expect(minifyJson('{\n  "a": [1, 2]\n}')).toBe('{"a":[1,2]}');
  });
});
