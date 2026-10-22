export const SUPPORTED_FLAGS = ['g', 'i', 'm', 's', 'u'] as const;

/** Stop collecting after this many matches so huge inputs can't freeze the UI. */
export const MAX_MATCHES = 10_000;

export interface RegexMatch {
  index: number;
  end: number;
  text: string;
  /** Numbered capture groups ($1, $2, ...); undefined when a group didn't participate. */
  groups: (string | undefined)[];
  namedGroups: Record<string, string | undefined>;
}

export type TestResult =
  | { ok: true; matches: RegexMatch[]; truncated: boolean }
  | { ok: false; error: string };

export interface Segment {
  text: string;
  match: boolean;
}

/** Compiles the pattern and returns every match. Never throws: bad input comes back as `error`. */
export function testRegex(pattern: string, flags: string, text: string): TestResult {
  const unknown = [...flags].filter((f) => !(SUPPORTED_FLAGS as readonly string[]).includes(f));
  if (unknown.length) return { ok: false, error: `Unsupported flag: ${unknown.join(', ')}` };

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  return { ok: true, ...findMatches(regex, text) };
}

export function findMatches(regex: RegExp, text: string, limit = MAX_MATCHES): { matches: RegexMatch[]; truncated: boolean } {
  // Always iterate with a private global copy so the caller's lastIndex is untouched.
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  const matches: RegexMatch[] = [];

  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({
      index: m.index,
      end: m.index + m[0].length,
      text: m[0],
      groups: m.slice(1),
      namedGroups: { ...m.groups },
    });
    if (!regex.global) break;
    if (matches.length >= limit) return { matches, truncated: re.exec(text) !== null };
    // A zero-length match leaves lastIndex in place; step past it to avoid looping forever.
    if (m[0] === '') re.lastIndex = advance(text, re.lastIndex, re.unicode);
  }
  return { matches, truncated: false };
}

/** Splits text into alternating plain / matched runs for highlighting. Empty matches are skipped. */
export function segmentText(text: string, matches: RegexMatch[]): Segment[] {
  const segments: Segment[] = [];
  let pos = 0;
  for (const { index, end } of matches) {
    if (end === index) continue;
    if (index > pos) segments.push({ text: text.slice(pos, index), match: false });
    segments.push({ text: text.slice(index, end), match: true });
    pos = end;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos), match: false });
  return segments;
}

/** Matches serialised as JSON for copying. */
export function formatMatches(matches: RegexMatch[]): string {
  return JSON.stringify(matches, null, 2);
}

function advance(text: string, index: number, unicode: boolean): number {
  if (unicode && index < text.length - 1) {
    const code = text.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(index + 1);
      if (next >= 0xdc00 && next <= 0xdfff) return index + 2;
    }
  }
  return index + 1;
}
