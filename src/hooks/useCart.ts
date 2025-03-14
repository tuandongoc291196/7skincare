import { CartProduct } from "@/types/schema/cart";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
  items: CartProduct[];
  addItem: (item: CartProduct) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: Partial<CartProduct>) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    set => ({
      items: [],
      addItem: item =>
        set(state => {
          const existingItem = state.items.find(i => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: id =>
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        })),
      updateItem: (id, updatedItem) =>
        set(state => ({
          items: state.items.map(item => (item.id === id ? { ...item, ...updatedItem } : item)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        items: state.items,
      }),
    }
  )
);

export default useCartStore;
