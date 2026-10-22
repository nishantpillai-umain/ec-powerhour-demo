import { describe, expect, it } from 'vitest';
import { decodeBase64Url, decodeJwt } from './logic';

const b64url = (value: unknown) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const makeToken = (header: unknown, payload: unknown, signature = 'sig') =>
  `${b64url(header)}.${b64url(payload)}.${signature}`;

// The example token from jwt.io
const JWT_IO =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeBase64Url', () => {
  it('decodes unpadded URL-safe input as UTF-8', () => {
    expect(decodeBase64Url(b64url('héllo ✓'))).toBe('"héllo ✓"');
  });

  it('rejects characters outside the base64url alphabet', () => {
    expect(() => decodeBase64Url('abc+')).toThrow();
    expect(() => decodeBase64Url('ab=c')).toThrow();
  });

  it('rejects impossible lengths', () => {
    expect(() => decodeBase64Url('abcde')).toThrow();
  });
});

describe('decodeJwt', () => {
  it('decodes header, payload and signature', () => {
    const result = decodeJwt(JWT_IO);
    expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(result.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 });
    expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  it('ignores surrounding whitespace', () => {
    expect(decodeJwt(`  ${JWT_IO}\n`).payload.name).toBe('John Doe');
  });

  it('converts time claims to dates', () => {
    const token = makeToken({ alg: 'none' }, { iat: 1700000000, nbf: 1700000000, exp: 1700003600 });
    const { times } = decodeJwt(token, new Date(1700000000_000));
    expect(times.map((t) => [t.claim, t.date.toISOString()])).toEqual([
      ['exp', '2023-11-14T23:13:20.000Z'],
      ['iat', '2023-11-14T22:13:20.000Z'],
      ['nbf', '2023-11-14T22:13:20.000Z'],
    ]);
  });

  it('skips time claims that are not numbers', () => {
    const token = makeToken({ alg: 'none' }, { exp: 'tomorrow' });
    const result = decodeJwt(token);
    expect(result.times).toEqual([]);
    expect(result.expired).toBe(false);
  });

  it('flags expired tokens', () => {
    const token = makeToken({ alg: 'none' }, { exp: 1700000000 });
    expect(decodeJwt(token, new Date(1700000001_000)).expired).toBe(true);
    expect(decodeJwt(token, new Date(1699999999_000)).expired).toBe(false);
  });

  it('is not expired without exp', () => {
    expect(decodeJwt(JWT_IO).expired).toBe(false);
  });

  it('accepts an empty signature (alg none)', () => {
    expect(decodeJwt(makeToken({ alg: 'none' }, { a: 1 }, '')).signature).toBe('');
  });

  it('rejects the wrong number of segments', () => {
    expect(() => decodeJwt('abc.def')).toThrow('3 segments');
    expect(() => decodeJwt(`${JWT_IO}.extra`)).toThrow('this has 4');
  });

  it('rejects invalid base64url', () => {
    expect(() => decodeJwt('a$c.e30.sig')).toThrow('header is not valid base64url');
  });

  it('rejects invalid JSON', () => {
    const notJson = btoa('{nope').replace(/=+$/, '');
    expect(() => decodeJwt(`e30.${notJson}.sig`)).toThrow('payload is not valid JSON');
  });

  it('rejects JSON that is not an object', () => {
    expect(() => decodeJwt(`${b64url([1])}.e30.sig`)).toThrow('header must be a JSON object');
  });
});
