import { create } from "zustand";
import ApiClient from "../API/axios";
import { endpoints } from "../API/ApiEndPoint";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("authToken") || null,
  loading: false,
  error: null,

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  /* ================= LOGIN ================= */
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await ApiClient.post(endpoints.auth.login, {
        email,
        password,
      });

      localStorage.setItem("Token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });

      return data;
    } catch (err) {
      const errorMsg = err?.message || "Login failed";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  /* ================= REGISTER ================= */
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await ApiClient.post(endpoints.auth.register, {
        name,
        email,
        password,
        role: "customer",
      });

      localStorage.setItem("authToken", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });

      return data;
    } catch (err) {
      const errorMsg = err?.message || "Registration failed";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  /* ================= GOOGLE LOGIN ================= */
  googleLogin: async (idToken) => {
    set({ loading: true, error: null });
    try {
      const data = await ApiClient.post(endpoints.auth.google, {
        idToken,
      });

      localStorage.setItem("authToken", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });

      return data;
    } catch (err) {
      const errorMsg = err?.message || "Google login failed";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  /* ================= SEND OTP ================= */
  sendOtp: async (phoneNumber) => {
    set({ loading: true, error: null });
    try {
      const data = await ApiClient.post(endpoints.auth.sendOtp, {
        phoneNumber,
      });

      set({ loading: false });
      return data;
    } catch (err) {
      const errorMsg = err?.message || "OTP send failed";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  /* ================= VERIFY OTP ================= */
  verifyOtp: async (phoneNumber, otp) => {
    set({ loading: true, error: null });
    try {
      const data = await ApiClient.post(endpoints.auth.verifyOtp, {
        phoneNumber,
        otp,
      });

      localStorage.setItem("authToken", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });

      return data;
    } catch (err) {
      const errorMsg = err?.message || "OTP verification failed";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  /* ================= FETCH USER ================= */
  fetchUser: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    set({ loading: true });

    try {
      const data = await ApiClient.get(endpoints.auth.me);

      set({
        user: data.user,
        token,
        loading: false,
      });
    } catch (err) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");

      set({
        user: null,
        token: null,
        loading: false,
      });
    }
  },

  /* ================= LOGOUT ================= */
  logout: async () => {
    set({ loading: true });

    try {
      await ApiClient.post(endpoints.auth.logout);
    } catch (err) { }

    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    set({
      user: null,
      token: null,
      loading: false,
    });
  },
}));

export default useAuthStore;
