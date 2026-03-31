import { useState, useCallback, useEffect } from "react";
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
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "../store/CartStore";

const PROMOS = { SAVE10: 10, FIRST20: 20, CHEF15: 15 };
const FREE_DELIVERY_THRESHOLD = 25;
const DELIVERY_FEE = 3.99;

let _toastId = 0;

function useToast() {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "success") => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium pointer-events-auto ${
              t.type === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-white border border-gray-100 text-forest-900"
            }`}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
          >
            {t.type === "error" ? (
              <AlertCircle size={15} className="text-red-500 shrink-0" />
            ) : (
              <CheckCircle size={15} className="text-forest-500 shrink-0" />
            )}
            <span>{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-clay-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="h-9 w-40 bg-gray-200 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-24 bg-gray-100 rounded-lg animate-pulse mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-200 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse ml-1" />
                </div>
              </div>
            ))}
          </div>
          <div className="card p-5 space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-11 w-full bg-gray-200 rounded-xl animate-pulse mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
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
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ShoppingBag size={48} className="text-gray-300" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
          Browse Menu <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}

function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <motion.div
      layout
      className="card p-4 flex items-center gap-4"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
    >
      <div className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 rounded-xl object-cover bg-gray-100"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-food.png";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-forest-900 text-sm truncate">
          {item.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
          {item.description}
        </p>
        <p className="font-bold text-forest-800 text-base mt-1.5">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <motion.button
          onClick={onDecrement}
          className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors"
          whileTap={{ scale: 0.82 }}
          title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
        >
          {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={13} />}
        </motion.button>

        <span className="font-bold w-6 text-center text-forest-900 tabular-nums">
          {item.quantity}
        </span>

        <motion.button
          onClick={onIncrement}
          className="w-8 h-8 bg-forest-700 text-white rounded-full flex items-center justify-center hover:bg-forest-600 transition-colors"
          whileTap={{ scale: 0.82 }}
        >
          <Plus size={13} />
        </motion.button>

        <motion.button
          onClick={onRemove}
          className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full flex items-center justify-center ml-1 transition-colors"
          whileTap={{ scale: 0.82 }}
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const { cart, loading, fetchCart, updateQty, removeFromCart, clearCart } =
    useCartStore();
  const { toasts, push: pushToast, dismiss: dismissToast } = useToast();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const delivery =
    subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const discount = appliedPromo ? (subtotal * PROMOS[appliedPromo]) / 100 : 0;
  const total = subtotal + delivery - discount;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setAppliedPromo(code);
      setPromoError("");
      pushToast(`Promo "${code}" applied — ${PROMOS[code]}% off`);
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const handleIncrement = (item) =>
    updateQty(item.menuItemId, item.quantity + 1);

  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item.menuItemId);
      pushToast(`"${item.name}" removed`);
    } else {
      updateQty(item.menuItemId, item.quantity - 1);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.menuItemId);
    pushToast(`"${item.name}" removed`);
  };

  const handleClearCart = () => {
    clearCart();
    setAppliedPromo(null);
    pushToast("Cart cleared");
  };

  if (loading && !cart.length) return <CartSkeleton />;

  if (!loading && cart.length === 0) {
    return (
      <>
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
        <EmptyCart />
      </>
    );
  }

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

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
                {cart.length} item{cart.length !== 1 ? "s" : ""} in your order
              </p>
            </div>
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <CartItem
                    key={item.menuItemId}
                    item={item}
                    onIncrement={() => handleIncrement(item)}
                    onDecrement={() => handleDecrement(item)}
                    onRemove={() => handleRemove(item)}
                  />
                ))}
              </AnimatePresence>

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

              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                {[
                  [
                    Truck,
                    "Free Delivery",
                    `On orders above ₹${FREE_DELIVERY_THRESHOLD}`,
                  ],
                  [Shield, "Secure Payment", "100% safe & encrypted"],
                ].map(([Icon, title, sub]) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100"
                  >
                    <div className="w-9 h-9 bg-forest-50 rounded-xl flex items-center justify-center shrink-0">
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

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="card p-5">
                <h2 className="font-display font-bold text-forest-900 mb-5">
                  Order Summary
                </h2>

                <div className="mb-5">
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
                        onKeyDown={(e) => e.key === "Enter" && applyPromo()}
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

                  <AnimatePresence mode="wait">
                    {promoError && (
                      <motion.p
                        key="error"
                        className="text-red-500 text-xs mt-1.5"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {promoError}
                      </motion.p>
                    )}
                    {appliedPromo && (
                      <motion.p
                        key="success"
                        className="text-forest-600 text-xs mt-1.5 font-medium"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        ✓ {appliedPromo} — {PROMOS[appliedPromo]}% discount
                        applied!
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)}{" "}
                      items)
                    </span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span
                      className={
                        delivery === 0 ? "text-forest-600 font-medium" : ""
                      }
                    >
                      {delivery === 0 ? "FREE" : `₹${delivery.toFixed(2)}`}
                    </span>
                  </div>

                  <AnimatePresence>
                    {discount > 0 && (
                      <motion.div
                        className="flex justify-between text-forest-600 font-medium"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <span>Discount ({PROMOS[appliedPromo]}%)</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="border-t border-gray-100 pt-3 flex justify-between font-display font-bold text-forest-900 text-base">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <motion.button
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        appliedPromo,
                        discount,
                        total,
                        delivery,
                        subtotal,
                      },
                    })
                  }
                  className="btn-forest w-full mt-5 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}
                >
                  Proceed to Checkout <ChevronRight size={16} />
                </motion.button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  By placing an order you agree to our Terms of Service
                </p>
              </div>

              <AnimatePresence>
                {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
                  <motion.div
                    className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <Truck
                      size={16}
                      className="text-amber-600 shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-amber-700">
                      Add{" "}
                      <strong>
                        ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)}
                      </strong>{" "}
                      more to get <strong>FREE delivery!</strong>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
