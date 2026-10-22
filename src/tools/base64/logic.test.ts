import { describe, expect, it } from 'vitest';
import { decode, encode } from './logic';

describe('encode', () => {
  it('encodes plain text', () => {
    expect(encode('hello world')).toBe('aGVsbG8gd29ybGQ=');
  });

  it('produces URL-safe output without padding', () => {
    expect(encode('subjects?_d', true)).toBe('c3ViamVjdHM_X2Q');
  });
});

describe('decode', () => {
  it('decodes standard base64', () => {
    expect(decode('aGVsbG8gd29ybGQ=')).toBe('hello world');
  });

  it('decodes URL-safe base64 without padding', () => {
    expect(decode('c3ViamVjdHM_X2Q')).toBe('subjects?_d');
  });

  it('throws on garbage', () => {
    expect(() => decode('not base64!')).toThrow();
  });
});
