# Implement URL Encoder tool

Implement the planned tool in `src/tools/url/`.

- Encode/decode with a choice of `encodeURIComponent` vs `encodeURI`
- If the input is a full URL, show its parts (protocol, host, path, hash) and a table of decoded query params
- Malformed percent-encoding shows an error, never throws
- Pure logic in `logic.ts` with tests; set status to `ready`
