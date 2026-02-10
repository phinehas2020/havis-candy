import { NextResponse } from "next/server";
import { z } from "zod";

import { getStripeServerClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

const lineItemSchema = z.object({
  priceId: z.string().min(1),
  quantity: z.number().int().positive().max(10),
});

const checkoutSchema = z.object({
  lineItems: z.array(lineItemSchema).min(1).max(50),
});

function getSiteOrigin(request: Request) {
  const headerOrigin = request.headers.get("origin");

  if (headerOrigin) {
    return headerOrigin;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const stripe = getStripeServerClient();
    const origin = getSiteOrigin(request);

    // Validate all Stripe Prices are active
    const invalidPriceIds: string[] = [];
    for (const item of payload.lineItems) {
      try {
        const price = await stripe.prices.retrieve(item.priceId);
        if (!price.active) {
          invalidPriceIds.push(item.priceId);
        }
      } catch {
        invalidPriceIds.push(item.priceId);
      }
    }

    if (invalidPriceIds.length > 0) {
      return NextResponse.json(
        {
          error: "Some items are no longer available.",
          invalidPriceIds,
        },
        { status: 422 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      allow_promotion_codes: true,
      line_items: payload.lineItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products?checkout=canceled`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid checkout request." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          "Checkout is not configured yet. Add Stripe Price IDs in Sanity and a STRIPE_SECRET_KEY in your environment.",
      },
      { status: 500 },
    );
  }
}
