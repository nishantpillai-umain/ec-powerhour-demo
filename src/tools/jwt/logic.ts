export type JsonObject = Record<string, unknown>;

export interface TimeClaim {
  claim: 'exp' | 'iat' | 'nbf';
  date: Date;
}

export interface DecodedJwt {
  header: JsonObject;
  payload: JsonObject;
  signature: string;
  times: TimeClaim[];
  /** True when `exp` is present and in the past. */
  expired: boolean;
}

/** Decodes a base64url segment to a UTF-8 string. Throws on invalid characters or length. */
export function decodeBase64Url(segment: string): string {
  if (!/^[A-Za-z0-9_-]*$/.test(segment) || segment.length % 4 === 1) {
    throw new Error('invalid base64url');
  }
  let normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4) normalized += '=';
  const bytes = Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function parsePart(segment: string, name: string): JsonObject {
  let text: string;
  try {
    text = decodeBase64Url(segment);
  } catch {
    throw new Error(`The ${name} is not valid base64url.`);
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(`The ${name} is not valid JSON.`);
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`The ${name} must be a JSON object.`);
  }
  return value as JsonObject;
}

const TIME_CLAIMS = ['exp', 'iat', 'nbf'] as const;

/** Decodes a JWT without verifying its signature. Throws an Error with a user-facing message if malformed. */
export function decodeJwt(token: string, now: Date = new Date()): DecodedJwt {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error(`A JWT has 3 segments separated by dots, but this has ${parts.length}.`);
  }
  const [rawHeader, rawPayload, signature] = parts;
  const header = parsePart(rawHeader, 'header');
  const payload = parsePart(rawPayload, 'payload');

  const times: TimeClaim[] = [];
  for (const claim of TIME_CLAIMS) {
    const value = payload[claim];
    if (typeof value === 'number' && Number.isFinite(value)) {
      times.push({ claim, date: new Date(value * 1000) });
    }
  }
  const exp = times.find((t) => t.claim === 'exp');
  const expired = exp ? exp.date.getTime() <= now.getTime() : false;

  return { header, payload, signature, times, expired };
}
