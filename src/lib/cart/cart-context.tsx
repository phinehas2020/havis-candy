"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

// --- Types ---

export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  price: number;
  stripePriceId: string;
  imageUrl: string;
  quantity: number;
  inStock: boolean;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
};

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

// --- Constants ---

const STORAGE_KEY = "havis-candy-cart";
const MAX_QUANTITY = 10;

function sanitizeStoredItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const dedupedItems = new Map<string, CartItem>();

  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const item = entry as Partial<CartItem>;

    if (
      typeof item.productId !== "string" ||
      item.productId.length === 0 ||
      typeof item.stripePriceId !== "string" ||
      item.stripePriceId.length === 0
    ) {
      continue;
    }

    const normalized: CartItem = {
      productId: item.productId,
      title: typeof item.title === "string" ? item.title : "Untitled caramel",
      slug: typeof item.slug === "string" ? item.slug : item.productId,
      price:
        typeof item.price === "number" && Number.isFinite(item.price)
          ? Math.max(0, item.price)
          : 0,
      stripePriceId: item.stripePriceId,
      imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : "",
      quantity:
        typeof item.quantity === "number" && Number.isFinite(item.quantity)
          ? Math.min(Math.max(Math.round(item.quantity), 1), MAX_QUANTITY)
          : 1,
      inStock: Boolean(item.inStock),
    };

    const existing = dedupedItems.get(normalized.productId);
    if (existing) {
      dedupedItems.set(normalized.productId, {
        ...normalized,
        quantity: Math.min(existing.quantity + normalized.quantity, MAX_QUANTITY),
      });
      continue;
    }

    dedupedItems.set(normalized.productId, normalized);
  }

  return [...dedupedItems.values()];
}

// --- Reducer ---

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? {
                  ...i,
                  ...action.item,
                  quantity: Math.min(i.quantity + 1, MAX_QUANTITY),
                }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: Math.min(action.quantity, MAX_QUANTITY) }
            : i,
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items, hydrated: true };
    default:
      return state;
  }
}

// --- Context ---

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    hydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        dispatch({ type: "HYDRATE", items: sanitizeStoredItems(parsed) });
        return;
      }
    } catch {
      // Corrupted data — start fresh
    }
    dispatch({ type: "HYDRATE", items: [] });
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (state.hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      } catch {
        // Storage full or unavailable
      }
    }
  }, [state.items, state.hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      dispatch({ type: "ADD_ITEM", item });
      dispatch({ type: "OPEN_CART" });
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE_ITEM", productId }),
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items],
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      state.items,
      state.isOpen,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    ],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
