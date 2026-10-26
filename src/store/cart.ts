// ──────────────────────────────────────────────
// SANAAT — Zustand Cart Store with localStorage persistence
// ──────────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  hasPreorderItems: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const hasPreorderItems = items.some((item) => item.is_preorder);
  return { totalItems, totalPrice, hasPreorderItems };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      hasPreorderItems: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem: CartItem) => {
        const { items } = get();
        const existingIndex = items.findIndex((item) => item.variant_id === newItem.variant_id);

        let updatedItems: CartItem[];

        if (existingIndex > -1) {
          updatedItems = items.map((item, index) => {
            if (index === existingIndex) {
              const newQuantity = Math.min(
                item.quantity + newItem.quantity,
                newItem.max_quantity || 99
              );
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
        } else {
          updatedItems = [...items, { ...newItem }];
        }

        const totals = calculateTotals(updatedItems);
        set({
          items: updatedItems,
          isOpen: true, // open drawer on add
          ...totals,
        });
      },

      removeItem: (variantId: string) => {
        const updatedItems = get().items.filter((item) => item.variant_id !== variantId);
        const totals = calculateTotals(updatedItems);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        const updatedItems = get().items.map((item) => {
          if (item.variant_id === variantId) {
            const safeQty = Math.min(quantity, item.max_quantity || 99);
            return { ...item, quantity: safeQty };
          }
          return item;
        });

        const totals = calculateTotals(updatedItems);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          hasPreorderItems: false,
        });
      },
    }),
    {
      name: 'sanaat-cart',
      onRehydrateStorage: () => (state) => {
        if (state && state.items) {
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalPrice = totals.totalPrice;
          state.hasPreorderItems = totals.hasPreorderItems;
        }
      },
    }
  )
);
