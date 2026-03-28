import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import MenuItemCard from "../components/MenuItemCard";
import { useMenuStore } from "../store/useMenuStore";

export default function MenuPage() {
  const {
    menuItems,
    filteredItems,
    categories,
    selectedCategory,
    loading,
    error,
    fetchMenu,
    setCategory,
    searchItems,
    resetFilters,
  } = useMenuStore();

  console.log("tdfb", menuItems);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [dietFilter, setDietFilter] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    searchItems(val);
  };

  const sorted = useMemo(() => {
    let items = filteredItems.filter((item) => {
      const matchPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];
      const matchDiet =
        dietFilter.length === 0 ||
        dietFilter.some((d) => item.tags?.includes(d));
      return matchPrice && matchDiet;
    });
    if (sort === "rating")
      items = [...items].sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc")
      items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      items = [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [filteredItems, sort, priceRange, dietFilter]);

  const toggleDiet = (d) =>
    setDietFilter((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  const handleClearAll = () => {
    setSearch("");
    setPriceRange([0, 30]);
    setDietFilter([]);
    resetFilters();
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="hero-gradient py-14 px-6 relative overflow-hidden noise-overlay">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            className="text-saffron-400 font-semibold text-sm mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🍽️ What are you craving?
          </motion.p>
          <motion.h1
            className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Menu & Flavors
          </motion.h1>

          <motion.div
            className="max-w-lg mx-auto relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search burgers, pizza, salads..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 shadow-lg"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-forest-700 text-white shadow-green"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-forest-400 hover:text-forest-700"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-forest-900">
              {sorted.length}
            </span>{" "}
            items found
          </p>
          <div className="flex gap-2 items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className={`flex items-center gap-2 text-sm border rounded-xl px-3 py-2 transition-colors ${
                filterOpen
                  ? "bg-forest-700 text-white border-forest-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-forest-400"
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {dietFilter.length > 0 && (
                <span className="w-4 h-4 bg-saffron-400 text-forest-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {dietFilter.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-display font-semibold text-sm text-forest-900 mb-3">
                    Price Range
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, +e.target.value])}
                      className="flex-1 accent-forest-600"
                    />
                    <span className="text-sm font-medium text-gray-700 w-14">
                      ≤ ${priceRange[1]}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-forest-900 mb-3">
                    Dietary
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["vegan", "vegetarian", "spicy", "healthy", "light"].map(
                      (d) => (
                        <button
                          key={d}
                          onClick={() => toggleDiet(d)}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                            dietFilter.includes(d)
                              ? "bg-forest-700 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-forest-50"
                          }`}
                        >
                          {d}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setPriceRange([0, 30]);
                  setDietFilter([]);
                }}
                className="mt-4 text-xs text-gray-400 hover:text-forest-600 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-forest-600" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <span className="text-5xl">⚠️</span>
            <p className="font-display font-bold text-forest-900 text-xl mt-4">
              Something went wrong
            </p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
            <button onClick={() => fetchMenu(true)} className="btn-forest mt-4">
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
              >
                <span className="text-5xl">🍽️</span>
                <p className="font-display font-bold text-forest-900 text-xl mt-4">
                  No items found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filters
                </p>
                <button onClick={handleClearAll} className="btn-forest mt-4">
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={selectedCategory + search + sort}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {sorted.map((item, i) => (
                  <MenuItemCard key={item.id} item={item} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
