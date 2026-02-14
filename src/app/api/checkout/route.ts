import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { getProducts } from "@/lib/data/content";
import { getStripeServerClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

const lineItemSchema = z.object({
  productId: z.string().min(1).optional(),
  priceId: z.string().min(1),
  quantity: z.number().int().positive().max(10),
});

const checkoutSchema = z.object({
  lineItems: z.array(lineItemSchema).min(1).max(50),
});

type CheckoutPayload = z.infer<typeof checkoutSchema>;
type StoreProduct = Awaited<ReturnType<typeof getProducts>>[number];

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

function buildInlineCheckoutLineItem(
  product: StoreProduct,
  quantity: number,
): Stripe.Checkout.SessionCreateParams.LineItem {
  const unitAmount = Math.max(0, Math.round(product.price * 100));
  const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData =
    {
      name: product.title,
      ...(product.shortDescription
        ? { description: product.shortDescription }
        : {}),
      ...(product.imageUrl.startsWith("http")
        ? { images: [product.imageUrl] }
        : {}),
    };

  return {
    quantity,
    price_data: {
      currency: "usd",
      unit_amount: unitAmount,
      product_data: productData,
    },
  };
}

async function retrieveActivePrice(
  stripe: Stripe,
  priceId: string,
): Promise<Stripe.Price | null> {
  try {
    const price = await stripe.prices.retrieve(priceId);
    return price.active ? price : null;
  } catch {
    return null;
  }
}

async function findActivePriceForProduct(
  stripe: Stripe,
  product: StoreProduct,
): Promise<string | null> {
  if (product.stripePriceId) {
    const directPrice = await retrieveActivePrice(stripe, product.stripePriceId);
    if (directPrice) {
      return directPrice.id;
    }
  }

  const candidateProductIds: string[] = [];
  if (product.stripeProductId) {
    candidateProductIds.push(product.stripeProductId);
  }

  try {
    const searchResult = await stripe.products.search({
      query: `active:'true' AND metadata['sanityId']:'${product.id}'`,
      limit: 1,
    });
    if (searchResult.data[0]) {
      candidateProductIds.push(searchResult.data[0].id);
    }
  } catch {
    // Search may be unavailable in some Stripe accounts; we can still fall back.
  }

  for (const productId of candidateProductIds) {
    try {
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        currency: "usd",
        limit: 10,
      });
      const oneTimePrice = prices.data.find((price) => price.type === "one_time");
      if (oneTimePrice) {
        return oneTimePrice.id;
      }
    } catch {
      // Try the next candidate product ID.
    }
  }

  return null;
}

async function resolveLineItems(
  stripe: Stripe,
  payload: CheckoutPayload,
): Promise<{
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  unresolvedPriceIds: string[];
}> {
  const productIds = [...new Set(payload.lineItems.map((item) => item.productId).filter(Boolean))];
  const products = await getProducts();
  const productsById = new Map<string, StoreProduct>(
    products
      .filter((product) => productIds.includes(product.id))
      .map((product) => [product.id, product]),
  );

  const resolvedLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const unresolvedPriceIds: string[] = [];

  for (const item of payload.lineItems) {
    const activePrice = await retrieveActivePrice(stripe, item.priceId);
    if (activePrice) {
      resolvedLineItems.push({
        price: activePrice.id,
        quantity: item.quantity,
      });
      continue;
    }

    const canonicalProduct = item.productId
      ? productsById.get(item.productId)
      : undefined;

    if (
      canonicalProduct &&
      canonicalProduct.availableForPurchase &&
      canonicalProduct.inStock
    ) {
      const recoveredPriceId = await findActivePriceForProduct(
        stripe,
        canonicalProduct,
      );
      if (recoveredPriceId) {
        resolvedLineItems.push({
          price: recoveredPriceId,
          quantity: item.quantity,
        });
        continue;
      }

      resolvedLineItems.push(
        buildInlineCheckoutLineItem(canonicalProduct, item.quantity),
      );
      continue;
    }

    unresolvedPriceIds.push(item.priceId);
  }

  return {
    lineItems: resolvedLineItems,
    unresolvedPriceIds,
  };
}

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const stripe = getStripeServerClient();
    const origin = getSiteOrigin(request);

    const { lineItems, unresolvedPriceIds } = await resolveLineItems(stripe, payload);
    if (unresolvedPriceIds.length > 0) {
      return NextResponse.json(
        {
          error:
            "Some items could not be matched to an active checkout price. Please refresh products in Sanity/Stripe and try again.",
          invalidPriceIds: unresolvedPriceIds,
        },
        { status: 422 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      allow_promotion_codes: true,
      line_items: lineItems,
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
