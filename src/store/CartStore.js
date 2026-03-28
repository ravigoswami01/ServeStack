import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../Api/ApiBas";
import { endpoints } from "../Api/API_EndPowint";

// ---------------- HELPERS ----------------
const isLoggedIn = () => !!localStorage.getItem("authToken");

const normalizeCart = (items = []) => {
  return items
    .map((item) => {
      const id = item.menuItem?._id?.toString() || item.menuItemId?.toString();

      if (!id) return null;

      return {
        menuItemId: id,
        name: item.name || item.menuItem?.name || "Item",
        description: item.description || item.menuItem?.description,
        price: item.price || item.menuItem?.price || 0,
        image: item.menuItem?.imageUrl || item.image,
        quantity: item.quantity || 0,
      };
    })
    .filter(Boolean);
};

const compute = (cart) => ({
  cartCount: cart.reduce((a, b) => a + b.quantity, 0),
  cartTotal: cart.reduce((a, b) => a + b.price * b.quantity, 0),
});

// ---------------- STORE ----------------
export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      cartCount: 0,
      cartTotal: 0,

      // ---------------- FETCH CART ----------------
      fetchCart: async () => {
        if (!isLoggedIn()) return;

        try {
          set({ loading: true });

          const res = await apiClient.get(endpoints.cart.get);

          const cart = normalizeCart(res?.data?.cart?.items || []);

          set({
            cart,
            ...compute(cart),
            loading: false,
          });
        } catch (err) {
          console.error("Fetch cart error:", err);
          set({ loading: false });
        }
      },

      // ---------------- ADD ----------------
      addToCart: async (item) => {
        const id = item?._id?.toString();
        if (!id) return;

        const prev = get().cart;
        const exist = prev.find((i) => i.menuItemId === id);

        const updated = exist
          ? prev.map((i) =>
            i.menuItemId === id ? { ...i, quantity: i.quantity + 1 } : i,
          )
          : [
            ...prev,
            {
              menuItemId: id,
              name: item.name,
              description: item.description,
              price: item.price,
              image: item.imageUrl || item.image,
              quantity: 1,
            },
          ];

        set({ cart: updated, ...compute(updated) });

        if (!isLoggedIn()) return;

        try {
          await apiClient.post(endpoints.cart.add, {
            menuItemId: id,
            quantity: 1,
          });

          await get().fetchCart();
        } catch (err) {
          console.error("Add to cart error:", err);
          set({ cart: prev, ...compute(prev) });
        }
      },

      // ---------------- UPDATE ----------------
      updateQty: async (id, quantity) => {
        if (!id) return;

        if (quantity <= 0) {
          return get().removeFromCart(id);
        }

        const prev = get().cart;

        const updated = prev.map((i) =>
          i.menuItemId === id ? { ...i, quantity } : i,
        );

        set({ cart: updated, ...compute(updated) });

        if (!isLoggedIn()) return;

        try {
          await apiClient.put(endpoints.cart.updateQty, {
            menuItemId: id,
            quantity,
          });

          await get().fetchCart();
        } catch (err) {
          console.error("Update qty error:", err);
          set({ cart: prev, ...compute(prev) });
        }
      },

      // ---------------- REMOVE ----------------
      removeFromCart: async (id) => {
        if (!id) return;

        const prev = get().cart;
        const updated = prev.filter((i) => i.menuItemId !== id);

        set({ cart: updated, ...compute(updated) });

        if (!isLoggedIn()) return;

        try {
          await apiClient.delete(endpoints.cart.remove(id));

          await get().fetchCart();
        } catch (err) {
          console.error("Remove error:", err);
          set({ cart: prev, ...compute(prev) });
        }
      },

      // ---------------- CLEAR ----------------
      clearCart: async () => {
        const prev = get().cart;

        set({ cart: [], cartCount: 0, cartTotal: 0 });

        if (!isLoggedIn()) return;

        try {
          await apiClient.delete(endpoints.cart.clear);
        } catch (err) {
          console.error("Clear cart error:", err);
          set({ cart: prev, ...compute(prev) });
        }
      },

      // ---------------- MERGE ----------------
      mergeCart: async () => {
        if (!isLoggedIn()) return;

        const guestCart = get().cart;

        try {
          for (const item of guestCart) {
            await apiClient.post(endpoints.cart.add, {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
            });
          }

          await get().fetchCart();
        } catch (err) {
          console.error("Merge cart error:", err);
        }
      },

      // ---------------- LOCAL CLEAR ----------------
      clearLocalCart: () => {
        set({ cart: [], cartCount: 0, cartTotal: 0 });
      },
    }),
    {
      name: "cart-storage",

      onRehydrateStorage: () => (state) => {
        if (state) {
          const d = compute(state.cart);
          state.cartCount = d.cartCount;
          state.cartTotal = d.cartTotal;
        }
      },
    },
  ),
);
