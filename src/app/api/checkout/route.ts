import { NextResponse } from "next/server";
import { z } from "zod";

import { getStripeServerClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  priceId: z.string().min(1),
  quantity: z.number().int().positive().max(10).default(1),
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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      allow_promotion_codes: true,
      line_items: [
        {
          price: payload.priceId,
          quantity: payload.quantity,
        },
      ],
      success_url: `${origin}/products?checkout=success`,
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
