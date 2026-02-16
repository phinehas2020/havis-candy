"use client";

import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/types";

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items } = useCart();

  const inCart = items.find((i) => i.productId === product.id);
  const isAvailableForPurchase = product.availableForPurchase !== false;
  const cannotAdd = !isAvailableForPurchase || !product.inStock;

  function handleAdd() {
    if (cannotAdd) return;
    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      stripePriceId: product.stripePriceId,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
    });
  }

  if (!isAvailableForPurchase) {
    return (
      <button type="button" className="retro-button w-full" disabled>
        Coming Soon
      </button>
    );
  }

  if (!product.inStock) {
    return (
      <button type="button" className="retro-button w-full" disabled>
        Out of Stock
      </button>
    );
  }

  return (
    <button type="button" className="retro-button w-full" onClick={handleAdd}>
      {inCart ? `In Cart (${inCart.quantity})` : "Add to Cart"}
    </button>
  );
}
