import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  ChevronRight,
  Truck,
  Shield,
} from "lucide-react";
import { useStore } from "../store/useStore";

const PROMOS = { SAVE10: 10, FIRST20: 20, CHEF15: 15 };

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, addToast } = useStore();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = subtotal > 25 ? 0 : 3.99;
  const discount = appliedPromo ? (subtotal * PROMOS[appliedPromo]) / 100 : 0;
  const total = subtotal + delivery - discount;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setAppliedPromo(code);
      setPromoError("");
      addToast(`🎉 Promo "${code}" applied! ${PROMOS[code]}% off`);
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1800));
    clearCart();
    addToast("🎉 Order placed successfully!");
    navigate("/profile");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ShoppingBag size={48} className="text-gray-300" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/menu"
            className="btn-primary inline-flex items-center gap-2"
          >
            Browse Menu <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-clay-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-forest-900">
              Your Cart
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {cart.length} item{cart.length > 1 ? "s" : ""} in your order
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
          >
            <Trash2 size={14} /> Clear All
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="card p-4 flex items-center gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <div className="relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-forest-900 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                    <p className="font-bold text-forest-800 text-base mt-1.5">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <motion.button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:border-forest-500 hover:text-forest-700 transition-colors"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Minus size={13} />
                    </motion.button>
                    <span className="font-bold w-6 text-center text-forest-900">
                      {item.qty}
                    </span>
                    <motion.button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 bg-forest-700 text-white rounded-full flex items-center justify-center hover:bg-forest-600 transition-colors"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Plus size={13} />
                    </motion.button>
                    <motion.button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full flex items-center justify-center ml-1 transition-colors"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add more */}
            <Link
              to="/menu"
              className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-5 text-sm text-gray-400 hover:border-forest-400 hover:text-forest-600 transition-colors group"
            >
              <Plus
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              Add more items
            </Link>

            {/* Trust signals */}
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {[
                [Truck, "Free Delivery", "On orders above $25"],
                [Shield, "Secure Payment", "100% safe & encrypted"],
              ].map(([Icon, title, sub]) => (
                <div
                  key={title}
                  className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <div className="w-9 h-9 bg-forest-50 rounded-xl flex items-center justify-center">
                    <Icon size={16} className="text-forest-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-forest-900">
                      {title}
                    </p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card p-5">
              <h2 className="font-display font-bold text-forest-900 mb-5">
                Order Summary
              </h2>

              {/* Promo code */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={promo}
                      onChange={(e) => {
                        setPromo(e.target.value);
                        setPromoError("");
                      }}
                      placeholder="SAVE10, FIRST20..."
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-forest-700 text-white text-sm rounded-xl font-medium hover:bg-forest-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs mt-1">{promoError}</p>
                )}
                {appliedPromo && (
                  <motion.p
                    className="text-forest-600 text-xs mt-1 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✓ {appliedPromo} — {PROMOS[appliedPromo]}% discount applied!
                  </motion.p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span
                    className={
                      delivery === 0 ? "text-forest-600 font-medium" : ""
                    }
                  >
                    {delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <motion.div
                    className="flex justify-between text-forest-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </motion.div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-display font-bold text-forest-900 text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                onClick={placeOrder}
                disabled={placing}
                className="btn-forest w-full mt-5 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}
              >
                {placing ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        ease: "linear",
                      }}
                    />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order <ChevronRight size={16} />
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-400 text-center mt-3">
                By placing order you agree to our Terms of Service
              </p>
            </div>

            {/* Delivery info */}
            {subtotal < 25 && (
              <motion.div
                className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Truck size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Add <strong>${(25 - subtotal).toFixed(2)}</strong> more to get{" "}
                  <strong>FREE delivery!</strong>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
