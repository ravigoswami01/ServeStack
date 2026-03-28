import { create } from "zustand";
import apiClient from "../API/axios";
import { endpoints } from "../API/ApiEndPoint";

const CACHE_TIME = 5 * 60 * 1000;

export const useMenuStore = create((set, get) => ({
  menuItems: [],
  categories: [],
  filteredItems: [],
  selectedCategory: "All",
  loading: false,
  error: null,
  lastFetched: null,

  fetchMenu: async (force = false) => {
    const { lastFetched } = get();
    const isCacheValid = lastFetched && Date.now() - lastFetched < CACHE_TIME;

    if (isCacheValid && !force) return;

    set({ loading: true, error: null });

    try {
      const res = await apiClient.get(endpoints.menu.getAll);

      const items = res?.items || res?.data?.items || res?.data?.data || res?.data || [];

      const categories = [
        "All",
        ...Array.from(
          new Set(items.map((item) => item.category).filter(Boolean))
        ),
      ];

      set({
        menuItems: items,
        filteredItems: items,
        categories,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        loading: false,
        error: error?.response?.data?.message || error.message || "Failed to load menu",
      });
    }
  },

  setCategory: (category) => {
    const { menuItems } = get();
    const filtered =
      category === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === category);

    set({ selectedCategory: category, filteredItems: filtered });
  },

  searchItems: (query) => {
    const { menuItems, selectedCategory } = get();

    const base =
      selectedCategory === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === selectedCategory);

    const filtered = base.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase())
    );

    set({ filteredItems: filtered });
  },

  resetFilters: () => {
    const { menuItems } = get();
    set({ selectedCategory: "All", filteredItems: menuItems });
  },
}));