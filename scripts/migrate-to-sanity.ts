#!/usr/bin/env npx tsx
/**
 * Migrates fallback products to Sanity. Optionally creates Stripe products when STRIPE_SECRET_KEY is set.
 *
 * Run with: pnpm run migrate:sanity
 *
 * Requires in .env.local:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID
 * - NEXT_PUBLIC_SANITY_DATASET
 * - SANITY_API_WRITE_TOKEN
 *
 * Optional (for buyable products):
 * - STRIPE_SECRET_KEY — when set, creates Stripe products and links them to Sanity
 */

import { config } from "dotenv";
import { createClient } from "next-sanity";
import Stripe from "stripe";

import { fallbackProducts } from "../src/lib/data/fallback";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const writeToken = process.env.SANITY_API_WRITE_TOKEN;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!projectId || !dataset || !writeToken) {
  console.error(
    "Missing Sanity config. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN in .env.local"
  );
  process.exit(1);
}

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-08",
  useCdn: false,
  token: writeToken,
});

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status} ${url}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function uploadImageToSanity(imageUrl: string): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> {
  const buffer = await fetchImageBuffer(imageUrl);
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename: `product-${Date.now()}.jpg`,
  });
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

async function migrateProducts() {
  const withStripe = Boolean(stripe);
  console.log(
    `Starting migration of ${fallbackProducts.length} products to Sanity${withStripe ? " + Stripe" : ""}...\n`,
  );

  for (const product of fallbackProducts) {
    const docId = `product-${product.id}`;
    console.log(`Migrating: ${product.title} (${docId})`);

    try {
      // 1. Upload image to Sanity
      console.log("  → Uploading image...");
      const imageRef = await uploadImageToSanity(product.imageUrl);

      let stripeProductId: string | undefined;
      let stripePriceId: string | undefined;

      // 2. Create Stripe product + price (only when STRIPE_SECRET_KEY is set)
      if (stripe) {
        console.log("  → Creating Stripe product and price...");
        const stripeProduct = await stripe.products.create({
          name: product.title,
          description: product.shortDescription,
          active: product.inStock,
          images: [product.imageUrl],
          metadata: { sanityId: docId },
        });

        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(product.price * 100),
          currency: "usd",
        });

        stripeProductId = stripeProduct.id;
        stripePriceId = stripePrice.id;
      }

      // 3. Create/Replace Sanity document
      const doc = {
        _id: docId,
        _type: "product",
        title: product.title,
        slug: {
          _type: "slug",
          current: product.slug,
        },
        shortDescription: product.shortDescription,
        longDescription: product.longDescription ?? "",
        price: product.price,
        inStock: product.inStock,
        featured: product.featured ?? false,
        badge: product.badge ?? undefined,
        image: imageRef,
        ...(stripeProductId && { stripeProductId }),
        ...(stripePriceId && { stripePriceId }),
      };

      await sanityClient.createOrReplace(doc);
      console.log(
        stripePriceId
          ? `  ✓ Done. Stripe: ${stripeProductId}, Price: ${stripePriceId}\n`
          : `  ✓ Done (Sanity only; add STRIPE_SECRET_KEY later for checkout).\n`,
      );
    } catch (err) {
      console.error(`  ✗ Failed:`, err);
      throw err;
    }
  }

  console.log("Migration complete. Products are now in Sanity.");
  if (withStripe) {
    console.log("Open /studio to edit. Changes sync to Stripe via webhook.");
  } else {
    console.log("Add STRIPE_SECRET_KEY and re-run, or use the webhook after deploying, to enable checkout.");
  }
}

migrateProducts().catch((err) => {
  console.error(err);
  process.exit(1);
});
