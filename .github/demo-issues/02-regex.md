# Implement Regex Tester tool

Implement the planned tool in `src/tools/regex/`.

- Inputs: pattern, flags (g, i, m, s, u), test text
- Live-highlight matches in the text as you type
- List matches with index and capture groups (including named groups)
- Invalid pattern shows the error message, never throws
- Guard against zero-length match infinite loops
- Pure logic in `logic.ts` with tests; set status to `ready`
