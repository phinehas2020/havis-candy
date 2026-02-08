"use client";

import { useState } from "react";

type CheckoutButtonProps = {
  priceId?: string;
  productTitle: string;
  disabled?: boolean;
};

export function CheckoutButton({
  priceId,
  productTitle,
  disabled,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cannotCheckout = disabled || !priceId;

  async function handleCheckout() {
    if (!priceId || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          quantity: 1,
        }),
      });

      const payload = (await response.json()) as
        | { url?: string; error?: string }
        | undefined;

      if (!response.ok || !payload?.url) {
        setError(payload?.error ?? "Unable to start checkout right now.");
        return;
      }

      window.location.assign(payload.url);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="retro-button w-full"
        disabled={cannotCheckout || isLoading}
        onClick={handleCheckout}
      >
        {cannotCheckout
          ? "Coming Soon"
          : isLoading
            ? "Starting Checkout..."
            : `Buy Now`}
      </button>
      {error ? (
        <p className="text-sm text-[var(--color-danger)] text-pretty">{error}</p>
      ) : null}
    </div>
  );
}
