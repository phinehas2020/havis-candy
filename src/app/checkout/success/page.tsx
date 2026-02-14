import type { Metadata } from "next";
import Link from "next/link";

import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStripeServerClient } from "@/lib/stripe/server";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  let session: Awaited<
    ReturnType<ReturnType<typeof getStripeServerClient>["checkout"]["sessions"]["retrieve"]>
  > | null = null;

  if (session_id) {
    try {
      const stripe = getStripeServerClient();
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "line_items.data.price.product"],
      });
    } catch {
      // Invalid or expired session — show generic confirmation
    }
  }

  const customerEmail =
    session?.customer_details?.email ?? session?.customer_email;

  const orderComplete = !!session && session.payment_status === "paid";

  return (
    <>
      <ClearCartOnSuccess orderComplete={orderComplete} />
      <SiteHeader />
      <main className="min-h-dvh">
        <section className="section-lg candy-counter-bg">
          <div className="container container-narrow">
            <div className="retro-card-fancy p-6 sm:p-10">
              {/* Confirmation Header */}
              <div className="text-center mb-8">
                <div className="heritage-badge animate-in animate-float mx-auto mb-6">
                  <span className="heritage-badge-label">Thank You</span>
                  <span className="heritage-badge-year" style={{ fontSize: "var(--text-xl)" }}>
                    &#10003;
                  </span>
                  <span className="heritage-badge-text">Order Placed</span>
                </div>
                <h1 className="section-heading mb-3">Order Confirmed!</h1>
                <p className="body-text">
                  Thank you for your order. Your handmade caramels are on their
                  way!
                </p>
                {customerEmail && (
                  <p className="body-text-sm mt-2">
                    A receipt has been sent to{" "}
                    <strong>{customerEmail}</strong>.
                  </p>
                )}
              </div>

              {/* Line Items */}
              {session?.line_items?.data &&
                session.line_items.data.length > 0 && (
                  <div className="mb-8">
                    <h2 className="subheading mb-4">Items Purchased</h2>
                    <div className="space-y-3">
                      {session.line_items.data.map((item) => {
                        const product =
                          item.price?.product &&
                          typeof item.price.product === "object" &&
                          "name" in item.price.product
                            ? (item.price.product as { name: string })
                            : null;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-3 border-b-2 border-dashed border-[var(--color-border)]"
                          >
                            <div>
                              <p className="font-[family-name:var(--font-heading)] text-[var(--color-chocolate)]">
                                {product?.name ?? item.description}
                              </p>
                              <p className="text-sm text-[var(--color-mocha)]">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-[family-name:var(--font-heading)] text-[var(--color-chocolate)]">
                              ${((item.amount_total ?? 0) / 100).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t-3 border-[var(--color-dark)]">
                      <span className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-wider text-[var(--color-dark)]">
                        Total
                      </span>
                      <span className="font-[family-name:var(--font-heading)] text-xl text-[var(--color-chocolate)]">
                        $
                        {(
                          (session.amount_total ?? 0) / 100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="btn btn-primary">
                  Continue Shopping
                </Link>
                <Link href="/" className="btn btn-secondary">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
