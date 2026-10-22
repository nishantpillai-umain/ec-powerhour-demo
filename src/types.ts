export type ToolStatus = 'ready' | 'planned';

export interface Tool {
  /** URL slug, must match the folder name under src/tools/ */
  id: string;
  name: string;
  description: string;
  status: ToolStatus;
  /** Mounts the tool UI into `root`. Planned tools leave this out. */
  render?: (root: HTMLElement) => void;
}
