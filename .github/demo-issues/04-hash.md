# Implement Hash Generator tool

Implement the planned tool in `src/tools/hash/`.

- Input text, output SHA-1, SHA-256, SHA-384, SHA-512 as hex (use `crypto.subtle.digest`)
- Update live as you type
- Must handle unicode correctly (hash the UTF-8 bytes)
- Copy button per hash
- Tests against known vectors (e.g. empty string, "abc"); set status to `ready`
