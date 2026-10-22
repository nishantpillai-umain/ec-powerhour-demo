export type Indent = number | '\t';

export interface FormatOptions {
  indent: Indent;
  sortKeys: boolean;
}

export function formatJson(input: string, { indent, sortKeys }: FormatOptions): string {
  const parsed: unknown = JSON.parse(input);
  return JSON.stringify(sortKeys ? sortObjectKeys(parsed) : parsed, null, indent);
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

function sortObjectKeys(value: unknown): unknown {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return value;
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}
