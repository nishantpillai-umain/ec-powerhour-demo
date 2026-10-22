# Toolbox

A small collection of offline developer utilities: JSON formatter, Base64, Unix timestamps, colour converter, and more on the way.

Built as a demo project for working with Claude Code, both locally and with cloud agents.

## Getting started

```sh
git clone https://github.com/orjanberglin/ec-powerhour-demo.git toolbox
cd toolbox
git checkout -b my-attempt demo-start
npm install
npm run dev
```

Requires Node 22.12+.

`demo-start` is the project as it was before the demo: some tools unbuilt, bugs included. `main` has whatever was merged during the session.

```sh
npm test           # unit tests
npm run typecheck  # TypeScript
npm run build      # production build
```

## Try it yourself

1. **Build a tool.** Some tools in the sidebar are marked *Coming soon*. Pick one and ask Claude to implement it:
   > Implement the JWT Decoder tool.
2. **Hunt bugs.** The finished tools have a few bugs in them. Use the app, find something that's off, and ask Claude to fix it, ideally with a test that proves it. Some starting points:
   - Try characters outside plain ASCII.
   - Try the buttons that fill values in for you.
   - Try values formatted slightly differently than the examples.
   - Try reloading the page.
3. **Go parallel.** Start several cloud agents, each on its own issue, and review the PRs as they come in.

### Your own copy

Click **Use this template** (tick *Include all branches* to get `demo-start`). The *Seed demo issues* workflow creates the issues in your copy on the first push. If they don't show up, run it manually from the **Actions** tab.

See [`CLAUDE.md`](./CLAUDE.md) for how the project is structured.
