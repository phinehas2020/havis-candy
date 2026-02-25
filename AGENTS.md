# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Havi's Candy Co. — a Next.js 16 e-commerce site for handmade hard caramels. Single-service app (no database, no Docker). All data comes from Sanity CMS (SaaS) with hardcoded fallbacks in `src/lib/data/fallback.ts`, so the app runs fully without any environment variables configured.

### Commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` (port 3000) |
| Build | `pnpm build` |
| Lint | `pnpm lint` (ESLint 9 flat config) |
| Sanity migration | `pnpm migrate:sanity` |

### Key caveats

- **Build scripts**: `esbuild`, `sharp`, and `unrs-resolver` require approved build scripts. The `pnpm.onlyBuiltDependencies` field in `package.json` handles this non-interactively — do not run `pnpm approve-builds`.
- **Graceful degradation**: Without `STRIPE_SECRET_KEY`, the "Add to Cart" button still works (cart is client-side), but checkout will fail. Without Sanity tokens, fallback product data is used automatically.
- **Environment file**: Copy `.env.example` to `.env.local`. The app works without filling in any values.
- **No automated tests**: The project has no test suite — there is no `test` script in `package.json`.
- **Lockfile compatibility**: pnpm 10.x may regenerate the lockfile on install (warning about incompatible lockfile). This is safe.
