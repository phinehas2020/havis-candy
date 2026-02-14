# Havi's Candy Co. Website

A two-route Next.js site for Havi's Candy Co.:
- `/` → premium one-page brand + local conversion experience
- `/products` → dedicated product catalog and Stripe checkout entry

The build is designed around a classy American-retro visual direction with generous whitespace, Sanity-managed content, and Waco-focused SEO foundations.

## Tech Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Sanity (content modeling + Studio at `/studio`)
- Stripe Checkout Sessions (payment pipeline)
- JSON-LD structured data (LocalBusiness + Product ItemList + FAQ)

## Local Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. See the example file for all keys. Required for full functionality:

- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`
- Stripe: `STRIPE_SECRET_KEY`
- Webhook (for Sanity→Stripe sync): `SANITY_WEBHOOK_SECRET`

If Sanity vars are missing, the site uses built-in fallback content. If `STRIPE_SECRET_KEY` or `stripePriceId` values are missing, Add to Cart shows "Coming Soon".

## Sanity + Stripe Setup (Full Checkout)

### 1. Create Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage) and create a project + dataset.
2. In **API** → **Tokens**, create a token with **Editor** permissions.
3. Set in `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` (project ID from URL)
   - `NEXT_PUBLIC_SANITY_DATASET` (e.g. `production`)
   - `SANITY_API_READ_TOKEN`
   - `SANITY_API_WRITE_TOKEN` (same token is fine for local dev)

### 2. Import Products to Sanity + Stripe

The migration script adds all fallback products (Sorghum, Chai, Coffee, Peppermint) to Sanity, uploads images, creates Stripe products/prices, and writes IDs back to Sanity. Run once:

```bash
pnpm install
pnpm run migrate:sanity
```

Requires `STRIPE_SECRET_KEY` in `.env.local`. After migration, products appear in both Sanity Studio (`/studio`) and Stripe Dashboard.

### 3. Sanity → Stripe Webhook (Optional, for Studio edits)

When you edit products in Sanity Studio, a webhook keeps Stripe in sync. Configure it after deploying:

1. Deploy to Vercel and set env vars (including `SANITY_WEBHOOK_SECRET`).
2. In Sanity **Manage** → **API** → **Webhooks**, add:
   - **URL**: `https://www.haviscandyco.com/api/sanity-webhook`
   - **HTTP method**: POST
   - **Trigger**: Create, Update, Delete on `product`
   - **Secret**: same value as `SANITY_WEBHOOK_SECRET`
3. Set `SANITY_WEBHOOK_SECRET` in Vercel env to match.

If the webhook is not configured, you can still edit products in Sanity; Stripe won’t auto-update until you configure it or re-run the migration for new products.

### 4. Add / Edit Products

- **In Sanity Studio** (`/studio`): Create or edit `product` documents. Set title, slug, price, image, in-stock, badge, featured.
- **Stripe IDs**: Managed automatically by the webhook. For products created via the migration script, IDs are already set.

## SEO + Local SEO Foundations

Implemented by default:

- Crawlable pages with `robots.ts` and `sitemap.ts`
- Canonical metadata for `/` and `/products`
- Waco-intent keyword inclusion in metadata and body copy
- LocalBusiness + Product + FAQ JSON-LD
- Natural local entity mentions (Waco, Central Texas, retail partners)

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
pnpm sanity
pnpm run migrate:sanity   # Import fallback products to Sanity + create Stripe products
```

`pnpm build` is configured with webpack mode for stable builds in restricted environments.

## Project Structure

- `src/app/page.tsx` — one-page marketing experience
- `src/app/products/page.tsx` — product catalog page
- `src/app/api/checkout/route.ts` — Stripe Checkout session endpoint
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio
- `src/lib/data/content.ts` — Sanity fetch layer with fallback content
- `src/sanity/schemaTypes/*` — Sanity schema definitions

## Deployment

Deploy to Vercel and set the same environment variables in project settings.
