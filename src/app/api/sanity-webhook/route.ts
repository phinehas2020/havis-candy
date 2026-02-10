import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/write-client";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { getStripeServerClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

type SanityWebhookBody = {
  _id: string;
  _type: string;
  title?: string;
  price?: number;
  shortDescription?: string;
  image?: unknown;
  inStock?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
};

function verifySecret(request: Request): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) return false;
  return request.headers.get("sanity-webhook-secret") === secret;
}

export async function POST(request: Request) {
  if (!verifySecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sanityWriteClient) {
    return NextResponse.json(
      { error: "Sanity write client not configured" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as SanityWebhookBody;

  if (body._type !== "product") {
    return NextResponse.json({ skipped: true });
  }

  // Determine if this is a delete event (Sanity sends minimal payload on delete)
  const isDelete = !body.title && !body.price && !body.shortDescription;

  // Short-circuit if only Stripe fields changed (prevents webhook loop)
  // When we write back stripeProductId/stripePriceId, Sanity fires another webhook.
  // We detect this by checking if the payload only has _id, _type, and Stripe fields.
  const nonStripeFields = Object.keys(body).filter(
    (k) => !["_id", "_type", "stripeProductId", "stripePriceId"].includes(k),
  );
  if (!isDelete && nonStripeFields.length === 0) {
    return NextResponse.json({ skipped: "stripe-field-only-update" });
  }

  try {
    const stripe = getStripeServerClient();

    // --- DELETE: Archive Stripe Product ---
    if (isDelete) {
      if (body.stripeProductId) {
        await stripe.products.update(body.stripeProductId, { active: false });
      }
      if (body.stripePriceId) {
        await stripe.prices.update(body.stripePriceId, { active: false });
      }
      return NextResponse.json({ action: "archived" });
    }

    const imageUrl = getSanityImageUrl(body.image) ?? undefined;
    const priceInCents = Math.round((body.price ?? 0) * 100);

    // --- UPDATE: Existing Stripe Product ---
    if (body.stripeProductId) {
      await stripe.products.update(body.stripeProductId, {
        name: body.title ?? "Untitled Product",
        description: body.shortDescription ?? "",
        active: Boolean(body.inStock),
        ...(imageUrl ? { images: [imageUrl] } : {}),
        metadata: { sanityId: body._id },
      });

      // Check if price changed — if so, archive old price and create new one
      if (body.stripePriceId) {
        const existingPrice = await stripe.prices.retrieve(body.stripePriceId);
        if (existingPrice.unit_amount !== priceInCents) {
          // Archive old price
          await stripe.prices.update(body.stripePriceId, { active: false });

          // Create new price
          const newPrice = await stripe.prices.create({
            product: body.stripeProductId,
            unit_amount: priceInCents,
            currency: "usd",
          });

          // Write new price ID back to Sanity
          await sanityWriteClient
            .patch(body._id)
            .set({ stripePriceId: newPrice.id })
            .commit();

          return NextResponse.json({
            action: "updated",
            priceChanged: true,
            stripePriceId: newPrice.id,
          });
        }
      }

      return NextResponse.json({ action: "updated" });
    }

    // --- CREATE: New Stripe Product + Price ---
    const stripeProduct = await stripe.products.create({
      name: body.title ?? "Untitled Product",
      description: body.shortDescription ?? "",
      active: Boolean(body.inStock),
      ...(imageUrl ? { images: [imageUrl] } : {}),
      metadata: { sanityId: body._id },
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: priceInCents,
      currency: "usd",
    });

    // Write Stripe IDs back to Sanity
    await sanityWriteClient
      .patch(body._id)
      .set({
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      })
      .commit();

    return NextResponse.json({
      action: "created",
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });
  } catch (error) {
    console.error("Sanity webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
