import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../API/axios";
import { endpoints } from "../API/ApiEndPoint";

const normalizeCart = (items = []) =>
  items.map((item) => ({
    menuItemId: item?.menuItem?._id,
    name: item?.menuItem?.name ?? item?.name,
    description: item?.menuItem?.description ?? item?.description ?? "",
    price: Number(item?.menuItem?.price ?? item?.price ?? 0),
    image: item?.menuItem?.imageUrl ?? item?.image ?? "",
    quantity: Number(item?.quantity || 1),
  }));

const compute = (cart) => ({
  cartCount: cart.reduce((a, b) => a + b.quantity, 0),
  cartTotal: cart.reduce((a, b) => a + b.price * b.quantity, 0),
});

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      cartCount: 0,
      cartTotal: 0,

      fetchCart: async () => {
        const hasPersistedCart = get().cart.length > 0;
        if (!hasPersistedCart) set({ loading: true });
        try {
          const res = await apiClient.get(endpoints.cart.get);
          const cart = normalizeCart(res.cart?.items ?? []);
          set({ cart, ...compute(cart), loading: false });
        } catch {
          set({ loading: false });
        }
      },

      addToCart: async (menuItemId, quantity = 1) => {
        try {
          const res = await apiClient.post(endpoints.cart.add, { menuItemId, quantity });
          const cart = normalizeCart(res.cart?.items ?? []);
          set({ cart, ...compute(cart) });
        } catch (err) {
          console.error("addToCart:", err?.response?.data ?? err.message);
        }
      },

      updateQty: async (menuItemId, quantity) => {
        if (!menuItemId) return;
        try {
          const res = await apiClient.put(endpoints.cart.updateQty, { menuItemId, quantity });
          const cart = normalizeCart(res.cart?.items ?? []);
          set({ cart, ...compute(cart) });
        } catch (err) {
          console.error("updateQty:", err?.response?.data ?? err.message);
        }
      },

      removeFromCart: async (menuItemId) => {
        if (!menuItemId) return;
        try {
          const res = await apiClient.delete(endpoints.cart.remove(menuItemId));
          const cart = normalizeCart(res.cart?.items ?? []);
          set({ cart, ...compute(cart) });
        } catch (err) {
          console.error("removeFromCart:", err?.response?.data ?? err.message);
        }
      },

      clearCart: async () => {
        try {
          await apiClient.delete(endpoints.cart.clear);
          set({ cart: [], cartCount: 0, cartTotal: 0 });
        } catch (err) {
          console.error("clearCart:", err?.response?.data ?? err.message);
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        cartCount: state.cartCount,
        cartTotal: state.cartTotal,
      }),
    }
  )
);