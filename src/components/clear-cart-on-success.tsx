"use client";

import { useEffect } from "react";

import { useCart } from "@/lib/cart/cart-context";

type ClearCartOnSuccessProps = {
  orderComplete: boolean;
};

export function ClearCartOnSuccess({ orderComplete }: ClearCartOnSuccessProps) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (orderComplete) {
      clearCart();
    }
  }, [orderComplete, clearCart]);

  return null;
}
