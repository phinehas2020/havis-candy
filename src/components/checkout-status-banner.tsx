"use client";

import { useSearchParams } from "next/navigation";

export function CheckoutStatusBanner() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");

  if (checkout !== "success" && checkout !== "canceled") {
    return null;
  }

  const isSuccess = checkout === "success";

  return (
    <div
      className="rounded border px-4 py-3 text-sm"
      style={{
        borderColor: isSuccess ? "var(--color-success)" : "var(--color-border)",
        backgroundColor: isSuccess ? "#edf6ef" : "var(--color-surface)",
        color: isSuccess ? "var(--color-success)" : "var(--color-muted)",
      }}
    >
      {isSuccess
        ? "Thank you! Your payment was successful."
        : "Checkout was canceled. Your cart is still waiting for you."}
    </div>
  );
}
