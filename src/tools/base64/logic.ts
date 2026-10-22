export function encode(text: string, urlSafe = false): string {
  const encoded = btoa(text);
  return urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded;
}

/** Accepts both standard and URL-safe input, with or without padding. */
export function decode(input: string): string {
  let normalized = input.trim().replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4) normalized += '=';
  return atob(normalized);
}
