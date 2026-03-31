import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import MenuItemCard from "../components/MenuItemCard";
import { useMenuStore } from "../store/useMenuStore";
import { useCartStore } from "../store/CartStore";

const PRICE_MAX = 3000;

export default function MenuPage() {
  const {
    filteredItems = [],
    categories = [],
    selectedCategory,
    loading,
    error,
    fetchMenu,
    setCategory,
    searchItems,
    resetFilters,
  } = useMenuStore();

  const { addToCart, fetchCart } = useCartStore();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [dietFilter, setDietFilter] = useState([]);

  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    searchItems(val);
  };

  const toggleDiet = (d) => {
    setDietFilter((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const handleClearAll = () => {
    setSearch("");
    setPriceRange([0, PRICE_MAX]);
    setDietFilter([]);
    resetFilters();
  };

  const sorted = useMemo(() => {
    let items = filteredItems.filter((item) => {
      const price = Number(item?.price || 0);
      const matchPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchDiet =
        dietFilter.length === 0 ||
        dietFilter.some((d) => item?.tags?.includes(d));
      return matchPrice && matchDiet;
    });

    if (sort === "rating")
      items = [...items].sort(
        (a, b) => Number(b?.rating || 0) - Number(a?.rating || 0),
      );
    if (sort === "price-asc")
      items = [...items].sort(
        (a, b) => Number(a?.price || 0) - Number(b?.price || 0),
      );
    if (sort === "price-desc")
      items = [...items].sort(
        (a, b) => Number(b?.price || 0) - Number(a?.price || 0),
      );

    return items;
  }, [filteredItems, sort, priceRange, dietFilter]);

  return (
    <div className="min-h-screen pt-20">
      <div className="py-14 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Menu</h1>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search food..."
            className="w-full pl-10 pr-10 py-2 border rounded-lg"
          />
          {search && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-3"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === cat ? "bg-green-600 text-white" : "border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-between mb-4">
          <p className="text-sm text-gray-500">{sorted.length} items</p>

          <div className="flex gap-2 items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1.5"
            >
              <option value="popular">Popular</option>
              <option value="rating">Rating</option>
              <option value="price-asc">Low → High</option>
              <option value="price-desc">High → Low</option>
            </select>

            <button
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`p-2 rounded-lg border transition-colors ${
                filterOpen
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-200"
              }`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Filters</h3>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Clear all
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">
                  Price Range: ₹{priceRange[0]} — ₹{priceRange[1]}
                </p>
                <input
                  type="range"
                  min={0}
                  max={PRICE_MAX}
                  step={50}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-green-600"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Diet</p>
                <div className="flex gap-2 flex-wrap">
                  {["veg", "non-veg", "vegan"].map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDiet(d)}
                      className={`px-3 py-1 rounded-full text-xs border capitalize transition-colors ${
                        dietFilter.includes(d)
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-100 animate-pulse h-64"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-3">Failed to load menu.</p>
            <button
              onClick={fetchMenu}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            {sorted.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-gray-400 mb-3">No items found</p>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {sorted.map((item, i) => (
                  <MenuItemCard
                    key={item?._id || i}
                    item={item}
                    index={i}
                    onAddToCart={() => {
                      if (!item?._id) return;
                      addToCart(item._id, 1);
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
