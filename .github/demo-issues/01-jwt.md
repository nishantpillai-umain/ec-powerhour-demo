# Implement JWT Decoder tool

Implement the planned tool in `src/tools/jwt/`.

- Paste a JWT and show header and payload as pretty-printed JSON
- If `exp`, `iat` or `nbf` are present, show them as human-readable dates, and flag the token as expired if `exp` is in the past
- Clear error for malformed tokens (wrong number of segments, invalid base64url, invalid JSON)
- No signature verification, decode only (say so in the UI)
- Pure logic in `logic.ts` with tests; set status to `ready`
