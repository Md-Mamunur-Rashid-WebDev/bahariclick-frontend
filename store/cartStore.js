// Zustand store for the shopping cart.
// Think of this like a global variable that any component can read or update.
// The cart is saved to localStorage so it persists when you refresh the page.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist( // persist: saves state to localStorage automatically
    (set, get) => ({
      items: [], // Array of cart items: { _id, name, price, image, quantity, slug }

      // Add item or increase quantity if already in cart
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find(item => item._id === product._id);

        if (existing) {
          set({
            items: items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },

      // Remove item completely from cart
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) });
      },

      // Update quantity of a specific item
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item._id === productId ? { ...item, quantity } : item
          ),
        });
      },

      // Clear the entire cart (called after successful order)
      clearCart: () => set({ items: [] }),

      // Computed values (derived from items array)
      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    { name: 'shopping-cart' } // localStorage key
  )
);

export default useCartStore;