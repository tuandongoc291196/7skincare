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
          const existingItem = state.items.find(i => i.productDetailId === item.productDetailId);
          if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + item.quantity, item.maxQuantity);
            return {
              items: state.items.map(i =>
                i.productDetailId === item.productDetailId ? { ...i, quantity: newQuantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: id =>
        set(state => ({
          items: state.items.filter(item => item.productDetailId !== id),
        })),
      updateItem: (id, updatedItem) =>
        set(state => ({
          items: state.items.map(item => {
            if (item.productDetailId === id) {
              const newQuantity = updatedItem.quantity
                ? Math.min(Math.max(1, updatedItem.quantity), item.maxQuantity)
                : item.quantity;
              return { ...item, ...updatedItem, quantity: newQuantity };
            }
            return item;
          }),
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
