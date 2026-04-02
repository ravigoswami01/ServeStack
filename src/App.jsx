import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChat from "./components/AIChat";
import Toaster from "./components/Toaster";

import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginRegister from "./pages/Loginpage";
import ProtectedRoute from "./Router/ProtectedRoute";

import { motion, AnimatePresence } from "framer-motion";
import CheckOutPage from "./pages/CheckOutPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/order-success" element={<OrderDetailsPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const loading = useAuthStore((state) => state.loading);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <AIChat />
      <Toaster />
    </BrowserRouter>
  );
}
