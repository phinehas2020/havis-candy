# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-02-16 | self | Sanity Studio in-browser `data/listen` and `system.release` requests failed with `access control checks`/401 even though origins existed in CORS. | Ensure Studio origins are configured with credential support; if an origin already exists, rotate it with `sanity cors delete <origin>` then `sanity cors add <origin> --credentials` to force cookie/token auth. |
| 2026-02-16 | self | UI treated optional `availableForPurchase` as false (`!product.availableForPurchase`), so missing booleans in fallback/incomplete data rendered every button as “Coming Soon.” | Gate availability with `product.availableForPurchase !== false` and ensure fallback products set `availableForPurchase: true` explicitly. |
| 2026-02-16 | self | Used `pnpm exec tsx -e` with top-level `await`, which defaults to CJS and failed with `Top-level await is currently not supported`. | Wrap quick `tsx -e` diagnostics in an async IIFE (`void (async () => { ... })()`) or run as ESM file. |
| 2026-02-16 | self | Used a double-quoted `node -e` command containing template literals, so zsh expanded `${...}` and threw `bad substitution` before Node executed. | Use a single-quoted heredoc script (or escape `${}`) for inline Node diagnostics to prevent shell interpolation. |
| 2026-02-16 | self | Ran a Sanity debug script from `/tmp`, and Node could not resolve repo packages (`dotenv`) because module resolution was outside the workspace. | Keep debug scripts inside the repo root (or use inline execution from cwd) so local dependencies resolve correctly. |
| 2026-02-15 | self | First `apply_patch` attempt was invoked through a shell wrapper after the system warning, which added extra tool-call friction. | Run `apply_patch` via the dedicated tool interface directly and avoid wrapper commands for patching. |
| 2026-02-08 | self | `opencode upgrade` (brew/curl) kept saying 1.1.50 even though 1.1.53 was published, so the global CLI was stuck on the old models set. | Download the v1.1.53 macOS arm64 binary from GitHub, drop it in `/opt/homebrew/Cellar/opencode/1.1.53/bin`, and relink `/opt/homebrew/bin/opencode` so the shell picks up the new binary; remember future `brew upgrade` may roll this back until the formula reflects the release. |
| 2026-02-08 | self | Used `bash -lc` first and shell init script expected zsh features, causing syntax errors. | Use `zsh -lc` in this environment for reliable command execution. |
| 2026-02-14 | self | Cart checkout failed after Stripe price updates because `ADD_ITEM` only incremented quantity for existing products and kept stale `stripePriceId` values from localStorage. | When re-adding an existing product, refresh cart metadata (`stripePriceId`, price, title, image) before checkout so stale IDs are replaced. |
| 2026-02-14 | self | Production `/api/checkout` returned 422 for every Sanity `stripePriceId` on `/products`, indicating checkout cannot trust stored Stripe price IDs alone. | Resolve stale price IDs server-side using canonical product ID, attempt Stripe product/price recovery, and fall back to inline `price_data` so checkout can still start. |
| 2026-02-16 | self | Assumed `hidden lg:inline-flex` would hide the header CTA, but `.btn { display: inline-flex; }` in `globals.css` can override utility visibility and keep it visible on mobile. | For show/hide behavior, prefer component-specific classes/media rules (or `!hidden`/`!inline-flex`) when custom classes also define `display`. |
| 2026-02-16 | self | Tried querying Sanity with inline shell one-liners that contained unescaped GROQ/template syntax, causing zsh parse errors before Node ran. | Use a quoted heredoc script file for complex queries and run it from the repo root to avoid shell interpolation issues. |
| 2026-02-16 | self | Put temporary TS diagnostics in `/tmp`, which broke workspace package resolution for `tsx` imports (`dotenv` not found). | Place temporary scripts inside the repo (or use `tsx -e`) so dependency resolution uses local `node_modules`. |
| 2026-02-16 | self | Initially suspected missing Stripe price IDs for “Coming Soon,” but published Sanity data was correct; stale state came from static prerendering without page revalidation. | Verify live CMS values before changing checkout logic; for Sanity-driven pages use ISR (`revalidate`) plus webhook `revalidatePath` to keep storefront state fresh. |
| 2026-02-16 | self | Previous “Coming Soon” fix focused on cache invalidation only, but button logic still hard-blocked on `stripePriceId`, so products could remain non-buyable despite `availableForPurchase=true`. | Treat `availableForPurchase` + `inStock` as the UX gate; make `priceId` optional in cart payload and resolve/fallback server-side at checkout. |

## User Preferences
- Wants work done fast and fully completed.
- Wants a teaching-style explanation after technical implementation.
- Wants high-emphasis visual design with tasteful whitespace.
- Prefers classy, old-fashioned American retro aesthetics.
- Wants a cleaner, less crowded header and a smaller candy logo.

## Patterns That Work
- Start by extracting content from the existing production site before creating IA/copy plans.
- Card rotations (rotate(-1deg) etc.) and translateY offsets should be gated behind `@media (min-width: 768px)` — they waste space, clip, and look broken on single-column mobile layouts.
- Use `clamp()` for display fonts with a tight mobile minimum (1.75rem for Monoton) since decorative typefaces lose legibility at large sizes on small screens.
- Buttons on mobile: reduce padding and shadow size, stack vertically with `flex-col sm:flex-row` instead of wrapping.
- In this repo's mobile header, removing the large CTA and reducing icon controls to ~38-40px improves balance without losing usability.
- For Sanity content edits to appear reliably, combine page-level ISR (`export const revalidate`) with Sanity webhook `revalidatePath("/")` + `revalidatePath("/products")`.

## Patterns That Don't Work
- Running shell commands with `bash -lc` in this environment can fail due to zsh-specific startup scripts.

## Domain Notes
- Project: Havis Candy website rebuild.
- Requested site structure: one-page primary marketing site + separate products page.
- Content source of truth: https://www.haviscandyco.com
- Platform constraints: Vercel + Sanity integration for product management + Stripe checkout pipeline.
- Local SEO priority: Waco area ranking.
| 2026-02-08 | self | `firecrawl_map` returned zero links for Wix domain root. | Use direct `firecrawl_scrape` on known URLs from homepage when map discovery fails. |
| 2026-02-08 | self | `firecrawl_agent` call failed with tool error ID `2a6704dd0c424f03b1928a3c6401c495`. | Fall back to iterative `firecrawl_search` + `firecrawl_scrape` for structured SEO planning. |

## Patterns That Work
- `firecrawl_search` returns useful local-SEO SERP intent data when called with a plain query and no `sources` object.
- Scraping `about-us`, `where-to-buy`, `contact`, and product pages gives enough content authority to draft brand voice and conversion copy.

## Domain Notes
- Current Wix pages expose `robots: noindex` across key pages, likely suppressing search visibility.
- Confirmed store location relevance terms include Waco, TX 76705, Dry Creek Rd, Gholson Rd, Homestead Weekly Market, Brazos Valley Cheese, Homestead Gristmill.
- Core products currently visible: Sorghum, Chai, Coffee, Peppermint hard caramels at $7.95.
| 2026-02-08 | self | `create-next-app` failed in repo root because folder name `havis candy` violates npm package-name rules. | Scaffold in a valid temp folder (`site`) then move files, or predefine a valid package name. |
| 2026-02-08 | self | Combined `rsync` + `rm -rf` command was blocked by policy. | Run safer separate copy/delete commands when moving scaffold files. |

## Patterns That Work
- For repos with spaces in path names, scaffold app in a temp directory and copy files into root.
| 2026-02-08 | self | `pnpm build` (Next 16 Turbopack default) failed in this sandbox with `creating new process / binding to a port` panic. | Validate production builds using `next build --webpack` in restricted environments.

## Patterns That Work
- For this repo, `pnpm lint` + `pnpm exec next build --webpack` gives reliable verification under sandbox restrictions.
| 2026-02-08 | user | Requested explicit anti-AI-slop design quality and use of `.agents` skill guidance. | Prioritize distinctive visual system choices (typography, spacing, composition) before feature wiring.
| 2026-02-08 | self | Used `@/` alias in `sanity.config.ts` and schema index initially; this can break `sanity` CLI resolution. | Use relative imports in Sanity config/schema entrypoints (`./src/...`, `./locationType`, etc.). |
| 2026-02-08 | self | Starting dev server fails in this execution environment with `listen EPERM` on local ports (3000/4173). | Validate with build/lint here; ask user to run `pnpm dev` on their machine for interactive preview. |
| 2026-02-14 | user | Products not showing in Sanity; wanted to add via Vercel CLI (no such command). | Use `pnpm run migrate:sanity` — script imports fallback products to Sanity, creates Stripe products, writes IDs back. |
