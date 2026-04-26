# OpenClaw on Replit

This project is a fresh GitHub clone of [OpenClaw](https://github.com/openclaw/openclaw) — a personal AI assistant gateway. The repo is a large pnpm monorepo containing:

- A Node.js gateway daemon (TypeScript, in `src/`)
- Native mobile/desktop apps (`apps/ios`, `apps/android`, `apps/macos`)
- A web "Control UI" frontend (`ui/`, Vite + Lit)
- Plugin SDKs and extensions (`packages/`, `extensions/`)
- Docs, scripts, tests, etc.

## What runs in Replit

Only the **Control UI** (`ui/`) is set up to run in this Replit environment. It is the user-facing web piece; it is a thin WebSocket client that connects to a self-hosted OpenClaw gateway daemon running on the user's own machine.

The native apps and the gateway daemon itself are not run here (they target macOS/iOS/Android or require local-only system access).

### Workflow

- **Start application** — runs `cd ui && npx vite --host 0.0.0.0 --port 5000`
  - Serves the Control UI on port 5000 (webview)
  - `ui/vite.config.ts` is configured with `host: 0.0.0.0`, `port: 5000`, and `allowedHosts: true` so the Replit iframe proxy can serve it.

### Deployment

Configured as a **static** deployment:

- Build: `cd ui && npm install --ignore-scripts && npx vite build`
- Public dir: `dist/control-ui`

### Notes on dependencies

- The repo's root `package.json` requires Node `>=22.14`, which Replit's `nodejs-20` module does not satisfy. To avoid a full root install (which also tries to re-install pnpm itself), only the `ui/` workspace's dependencies were installed using `npm install --ignore-scripts` inside `ui/`. `zod` was added there because it's imported by the UI but was missing from `ui/package.json`.
- If you want to develop the gateway daemon, the mobile apps, or run the full pnpm workspace, do that on a local machine with the recommended Node 22+/24 and pnpm 10.

### Expected runtime warnings

- The UI shows a "disconnected" banner and `ws://localhost:18789` WebSocket errors in the browser console. This is **by design** — it's trying to connect to a local OpenClaw gateway daemon that isn't running in Replit. To actually use the assistant, run `openclaw gateway run` on your host machine and follow the on-screen instructions in the UI.

## Project structure (high level)

```
.
├── ui/                  # Vite + Lit Control UI (the only thing started here)
├── src/                 # Gateway daemon (TypeScript)
├── apps/                # Native macOS / iOS / Android apps
├── packages/            # Plugin SDK packages
├── extensions/          # First-party channel/skill extensions
├── docs/                # Documentation site
├── openclaw.mjs         # CLI entrypoint
└── package.json         # Monorepo root (pnpm)
```

## Visual customizations made in Replit

These are local CSS-only tweaks layered on top of the upstream UI:

- **Login screen** (`ui/src/styles/login-polish.css`): compacted card width 640→440px, smaller logo (58→40px), tighter inputs (54→38px) and button (56→40px).
- **Chat screen** (`ui/src/styles/chat/{text,grouped,layout}.css`):
  - Centered single-column layout (max-width 768px) for chat groups and composer, ChatGPT/Claude style.
  - Text 14→15px, line-height 1.5→1.65 for better readability.
  - Assistant messages: no bubble or border (transparent); user messages: subtle pill with rounded 18px border.
  - Streaming indicator: blinking accent caret at end of line (replaced pulsing border).
  - Composer: rounded 22px pill card, accent focus glow, larger 15px text, circular high-contrast send button.

