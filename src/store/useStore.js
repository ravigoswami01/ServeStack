import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── Cart ─────────────────────────────────────────────
      cart: [],
      addToCart: (item) => {
        const { cart } = get()
        const existing = cart.find(c => c.id === item.id)
        if (existing) {
          set({ cart: cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) })
        } else {
          set({ cart: [...cart, { ...item, qty: 1 }] })
        }
      },
      removeFromCart: (id) => set(s => ({ cart: s.cart.filter(c => c.id !== id) })),
      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeFromCart(id); return }
        set(s => ({ cart: s.cart.map(c => c.id === id ? { ...c, qty } : c) }))
      },
      clearCart: () => set({ cart: [] }),
      get cartTotal() { return get().cart.reduce((s, c) => s + c.price * c.qty, 0) },
      get cartCount() { return get().cart.reduce((s, c) => s + c.qty, 0) },

      // ─── User / Auth ───────────────────────────────────────
      user: {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@example.com',
        avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Ravi',
        phone: '+91 98765 43210',
        address: 'B-42, Sector 15, Noida, UP 201301',
        joined: 'March 2024',
        points: 1240,
      },
      updateUser: (data) => set(s => ({ user: { ...s.user, ...data } })),

      // ─── Wishlist ──────────────────────────────────────────
      wishlist: [],
      toggleWishlist: (id) => {
        const { wishlist } = get()
        set({ wishlist: wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id] })
      },

      // ─── UI ────────────────────────────────────────────────
      chatOpen: false,
      setChatOpen: (v) => set({ chatOpen: v }),
      toasts: [],
      addToast: (msg, type = 'success') => {
        const id = Date.now()
        set(s => ({ toasts: [...s.toasts, { id, msg, type }] }))
        setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3000)
      },
      removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
    }),
    { name: 'delishdrop-store', partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, user: s.user }) }
  )
)
