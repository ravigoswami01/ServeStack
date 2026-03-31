import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, MessageCircle } from "lucide-react";
import { useStore } from "../store/useStore";
import { useCartStore } from "../store/CartStore";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { setChatOpen } = useStore();
  const { cartCount } = useCartStore();
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu & Flavors" },
    { to: "/booking", label: "Book a Table" },
    { to: token ? "/profile" : "/login", label: "My Orders" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-8 h-8 bg-forest-700 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.05 }}
            >
              <span className="text-white text-sm font-bold">S</span>
            </motion.div>
            <span
              className={`font-display font-bold text-lg ${
                scrolled || !isHome ? "text-forest-900" : "text-white"
              }`}
            >
              ServeStack
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-150 relative group ${
                  location.pathname === link.to
                    ? "text-forest-500"
                    : scrolled || !isHome
                      ? "text-gray-600 hover:text-forest-700"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-forest-500 rounded-full"
                    layoutId="nav-underline"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setChatOpen(true)}
              className={`hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                scrolled || !isHome
                  ? "text-forest-700 bg-forest-50 hover:bg-forest-100"
                  : "text-white bg-white/10 hover:bg-white/20"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={15} />
              AI Chef
            </motion.button>

            <Link to="/cart" className="relative">
              <motion.div
                className={`p-2 rounded-xl transition-colors ${
                  scrolled || !isHome
                    ? "text-forest-800 hover:bg-forest-50"
                    : "text-white hover:bg-white/10"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-400 text-forest-900 text-xs font-bold rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            <Link to={token ? "/profile" : "/login"}>
              {token && authUser ? (
                <motion.img
                  src={
                    authUser.avatar || "https://ui-avatars.com/api/?name=User"
                  }
                  alt={authUser.name || "User"}
                  className="w-8 h-8 rounded-full border-2 border-saffron-400 hidden md:block"
                  whileHover={{ scale: 1.08 }}
                />
              ) : (
                <div className="hidden md:block px-3 py-1.5 text-sm font-medium rounded-lg bg-forest-600 text-white">
                  Login
                </div>
              )}
            </Link>

            <button
              className={`md:hidden p-2 ${
                scrolled || !isHome ? "text-forest-800" : "text-white"
              }`}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-forest-950/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={link.to}
                  className="text-2xl font-display font-bold text-white hover:text-saffron-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                to={token ? "/profile" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="btn-primary mt-4"
              >
                {token ? "My Profile" : "Login"}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
