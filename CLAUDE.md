# Toolbox

Small offline dev utilities. Vanilla TypeScript + Vite, no framework, no backend.

## Commands
- `npm run dev` – dev server
- `npm test` – Vitest (run before finishing any task)
- `npm run typecheck` – tsc, must pass
- `npm run build` – typecheck + production build

## Structure
- `src/tools/<id>/` – one folder per tool. Tools are auto-discovered by `src/registry.ts`; never register a tool by hand.
  - `index.ts` – default-exports a `Tool` (see `src/types.ts`) with a `render(root)` function that builds the UI.
  - `logic.ts` – pure functions, no DOM. All the real work goes here.
  - `logic.test.ts` – unit tests for `logic.ts`.
- `src/ui.ts` – DOM helpers (`h`, `field`, `button`, `copyButton`). Use these instead of raw `document.createElement`.
- `src/style.css` – shared styles. Reuse existing classes (`toolbar`, `field`, `results`, `error`, `code`) before adding new ones.
- `src/main.ts` – app shell: sidebar + hash routing (`#/<tool-id>`).

## Conventions
- A planned tool has `status: 'planned'` and no `render`. When implementing it, add `render`, `logic.ts`, tests, and flip status to `'ready'`.
- Keep changes inside the tool's own folder. Only touch shared files (`main.ts`, `ui.ts`, `style.css`, `types.ts`) if the task requires it.
- Everything must work offline. No runtime dependencies, no network calls. Browser APIs (`crypto`, `Intl`, `TextEncoder`) are fine.
- Match the existing tools: show errors in a `.error` element, never `alert()`; give outputs a copy button.
