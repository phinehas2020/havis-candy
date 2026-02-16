import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutStatusBanner } from "@/components/checkout-status-banner";
import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/product-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProducts } from "@/lib/data/content";
import { buildProductsSchema } from "@/lib/seo/schemas";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products",
  description:
    "Shop Havi's handmade hard caramels, including sorghum, chai, coffee, and seasonal flavors from Waco, Texas.",
  alternates: {
    canonical: "/products",
  },
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <JsonLd data={buildProductsSchema(products)} />

      <SiteHeader />

      <main className="min-h-dvh">
        <section className="mx-auto w-full max-w-6xl space-y-10 px-6 pb-20 pt-14 md:px-10 md:pt-18">
          {/* Page Header */}
          <div className="max-w-3xl space-y-5">
            <span className="overline">Small-Batch Crafted</span>

            <h1 className="section-title">Handmade hard caramels from Waco, Texas.</h1>

            <p className="section-body-lg">
              Each flavor is made in small batches with all-natural ingredients and an
              old-fashioned approach to candy craft. Shipped fresh or available for local pickup.
            </p>

            <CheckoutStatusBanner />
          </div>

          {/* Decorative Divider */}
          <div className="ornament">
            <span className="ornament-icon" aria-hidden="true">&#10022;</span>
          </div>

          {/* Products */}
          <ProductGrid products={products} />

          {/* Local Pickup CTA */}
          <div className="retro-card-fancy flex flex-col items-start gap-5 p-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="section-heading text-2xl text-balance">
                Looking for local pickup options?
              </h2>
              <p className="text-[var(--color-muted)] text-pretty">
                Visit our homepage for current Waco-area retail partners and location details.
              </p>
            </div>
            <Link href="/#where-to-buy" className="retro-button shrink-0">
              View Waco Locations
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
