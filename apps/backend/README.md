# Backend

Elysia backend packaged as a Cloudflare Worker.

## Commands

```bash
bun run --cwd apps/backend dev
bun run --cwd apps/backend typecheck
bun run --cwd apps/backend build
bun run --cwd apps/backend deploy
```

`build` bundles the Worker with Wrangler using `--dry-run` and writes the output to `dist`.
