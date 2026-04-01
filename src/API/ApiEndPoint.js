export const endpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    google: "/api/auth/google",
    sendOtp: "/api/auth/send-otp",
    verifyOtp: "/api/auth/verify-otp",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },

  menu: {
    getAll: "/api/menu",
    getById: (id) => `/api/menu/${id}`,
  },

  cart: {
    add: "/api/cart/add",
    get: "/api/cart",
    updateQty: "/api/cart/update",
    remove: (menuItemId) => `/api/cart/remove/${menuItemId}`,
    clear: "/api/cart/clear",
  },

  order: {
    create: "/api/orders",
    place: "/api/orders/place",
    getAll: "/api/orders",
    getById: (id) => `/api/orders/${id}`,
    updateStatus: (id) => `/api/orders/${id}/status`,
    cancel: (id) => `/api/orders/${id}/cancel`,
  },
  promoCode: {
    apply: "/api/promos/apply",
  }

};
