"use client";

import Image from "next/image";
import { useState } from "react";

import { useCart } from "@/lib/cart/cart-context";

export function CartDrawer() {
  const {
    items,
    isOpen,
    subtotal,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (items.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const lineItems = items.map((item) => ({
        productId: item.productId,
        priceId: item.stripePriceId,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });

      const payload = (await response.json()) as {
        url?: string;
        error?: string;
        invalidPriceIds?: string[];
      };

      if (response.status === 422) {
        setError(
          payload.error ??
            "Some items are unavailable right now. Your cart was not changed.",
        );
        return;
      }

      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Unable to start checkout right now.");
        return;
      }

      // Redirect to Stripe; cart clears on success page after payment
      window.location.assign(payload.url);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="cart-backdrop"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your Cart</h2>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <p className="cart-drawer-empty-text">Your cart is empty</p>
            <button
              type="button"
              className="retro-button"
              onClick={closeCart}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-image">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={64}
                      height={80}
                      className="object-cover rounded-[var(--radius-sm)]"
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="cart-item-controls">
                      <div className="cart-qty-stepper">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          disabled={item.quantity >= 10}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.title}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-line-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-drawer-footer">
              {error && <p className="cart-drawer-error">{error}</p>}
              <div className="cart-drawer-subtotal">
                <span>Subtotal</span>
                <span className="cart-drawer-subtotal-amount">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                className="retro-button w-full"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Starting Checkout..." : "Checkout"}
              </button>
              <button
                type="button"
                className="cart-drawer-continue"
                onClick={closeCart}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
