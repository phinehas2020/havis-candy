"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { CheckoutButton } from "@/components/checkout-button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductGridProps = {
  products: Product[];
};

const filters = [
  { key: "all", label: "All Flavors" },
  { key: "in-stock", label: "In Stock" },
  { key: "seasonal", label: "Seasonal" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

export function ProductGrid({ products }: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const visibleProducts = useMemo(() => {
    if (activeFilter === "in-stock") {
      return products.filter((product) => product.inStock);
    }

    if (activeFilter === "seasonal") {
      return products.filter((product) => product.badge?.toLowerCase() === "seasonal");
    }

    return products;
  }, [activeFilter, products]);

  return (
    <div className="space-y-10">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => {
          const selected = activeFilter === filter.key;

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className="filter-pill"
              data-active={selected}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product, index) => (
          <article
            id={product.slug}
            key={product.id}
            className={cn(
              "product-card",
              index < 3 && "fade-in-up",
              index === 0 && "stagger-1",
              index === 1 && "stagger-2",
              index === 2 && "stagger-3"
            )}
          >
            {/* Badge */}
            {product.badge ? (
              <div className="absolute left-4 top-4 z-10">
                <span className="vintage-label">{product.badge}</span>
              </div>
            ) : null}

            {/* Image */}
            <div className="product-card-image">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="product-card-body">
              <div className="flex-1 space-y-2 mb-4">
                <h2 className="product-card-name text-balance">
                  {product.title}
                </h2>
                <p className="text-sm text-[var(--color-muted)] text-pretty leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="flex items-center justify-between border-t-2 border-dashed border-[var(--color-border)] pt-4 mb-4">
                <div className="price-tag">
                  <span className="price-tag-currency">$</span>
                  <span className="price-tag-amount tabular-nums">
                    {product.price.toFixed(2)}
                  </span>
                </div>
                <span className={product.inStock ? "status-in-stock" : "status-out-of-stock"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Checkout */}
              <CheckoutButton
                priceId={product.stripePriceId}
                productTitle={product.title}
                disabled={!product.inStock}
              />
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {visibleProducts.length === 0 && (
        <div className="retro-card-fancy text-center py-12">
          <p className="section-heading text-[var(--color-ink)] mb-2">
            No products found
          </p>
          <p className="section-body mb-6">
            Try selecting a different filter to see more options.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="retro-button"
          >
            View All Flavors
          </button>
        </div>
      )}
    </div>
  );
}
