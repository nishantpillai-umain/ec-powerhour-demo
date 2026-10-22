import type { Tool } from './types';

// Every folder in src/tools/ with an index.ts default-exporting a Tool is picked up automatically.
const modules = import.meta.glob<{ default: Tool }>('./tools/*/index.ts', { eager: true });

export const tools: Tool[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name));

export function findTool(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
