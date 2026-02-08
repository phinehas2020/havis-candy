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

Use `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://www.haviscandyco.com

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-08
SANITY_API_READ_TOKEN=

STRIPE_SECRET_KEY=
```

### Notes

- If Sanity environment variables are missing, the site uses built-in fallback content from the current production site copy.
- If `STRIPE_SECRET_KEY` or `stripePriceId` values are missing, checkout buttons show a safe fallback state.

## Sanity Setup

1. Create a Sanity project and dataset.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
3. Start app and open `/studio`.
4. Add content using these document types:
   - `siteSettings`
   - `product`
   - `location`
   - `testimonial`

Each `product` supports `stripePriceId` so Stripe Checkout can map directly from content.

## Stripe Setup

1. Create products/prices in Stripe.
2. Copy each Stripe Price ID (`price_...`) into the matching Sanity `product.stripePriceId`.
3. Set `STRIPE_SECRET_KEY` in `.env.local` and deployment env.
4. Checkout API route: `src/app/api/checkout/route.ts`

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
