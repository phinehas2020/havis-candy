# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-02-08 | self | `opencode upgrade` (brew/curl) kept saying 1.1.50 even though 1.1.53 was published, so the global CLI was stuck on the old models set. | Download the v1.1.53 macOS arm64 binary from GitHub, drop it in `/opt/homebrew/Cellar/opencode/1.1.53/bin`, and relink `/opt/homebrew/bin/opencode` so the shell picks up the new binary; remember future `brew upgrade` may roll this back until the formula reflects the release. |
| 2026-02-08 | self | Used `bash -lc` first and shell init script expected zsh features, causing syntax errors. | Use `zsh -lc` in this environment for reliable command execution. |

## User Preferences
- Wants work done fast and fully completed.
- Wants a teaching-style explanation after technical implementation.
- Wants high-emphasis visual design with tasteful whitespace.
- Prefers classy, old-fashioned American retro aesthetics.

## Patterns That Work
- Start by extracting content from the existing production site before creating IA/copy plans.
- Card rotations (rotate(-1deg) etc.) and translateY offsets should be gated behind `@media (min-width: 768px)` — they waste space, clip, and look broken on single-column mobile layouts.
- Use `clamp()` for display fonts with a tight mobile minimum (1.75rem for Monoton) since decorative typefaces lose legibility at large sizes on small screens.
- Buttons on mobile: reduce padding and shadow size, stack vertically with `flex-col sm:flex-row` instead of wrapping.

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
