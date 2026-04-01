import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Home, Utensils } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/CartStore";
import { useCheckoutStore } from "../store/checkoutStore";

export default function CheckOutPage() {
  const navigate = useNavigate();
  const { state } = useLocation(); // ✅ GET DATA FROM CART

  const { cart, clearCart } = useCartStore();

  const {
    orderType,
    setOrderType,
    address,
    setAddress,
    tableNumber,
    setTableNumber,
    placeOrder,
    loading,
    error,
  } = useCheckoutStore();

  /* ================= SAFE FALLBACK ================= */
  const subtotal = state?.subtotal || 0;
  const delivery = state?.delivery || 0;
  const discount = state?.discount || 0;
  const total = state?.total || 0;

  /* ================= VALIDATION ================= */
  const isValid =
    orderType === "delivery"
      ? address.street && address.city && address.phone
      : tableNumber;

  /* ================= PLACE ORDER ================= */
  const handleOrder = async () => {
    if (!isValid) return;

    const res = await placeOrder({
      cart,
      pricing: { subtotal, delivery, discount, total },
      orderType,
      address,
      tableNumber,
    });

    if (res.success) {
      clearCart();
      navigate("/order-success", {
        state: { order: res.order },
      });
    }
  };

  if (!cart.length) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 space-y-6"
      >
        <h1 className="text-2xl font-bold">Checkout</h1>

        {/* ORDER TYPE */}
        <div className="flex gap-4">
          <button
            onClick={() => setOrderType("delivery")}
            className={`px-4 py-2 rounded-lg ${
              orderType === "delivery" ? "bg-green-600 text-white" : "border"
            }`}
          >
            <Home size={16} /> Delivery
          </button>

          <button
            onClick={() => setOrderType("dine-in")}
            className={`px-4 py-2 rounded-lg ${
              orderType === "dine-in" ? "bg-green-600 text-white" : "border"
            }`}
          >
            <Utensils size={16} /> Dine-In
          </button>
        </div>

        {/* DELIVERY FORM */}
        <AnimatePresence>
          {orderType === "delivery" && (
            <motion.div
              key="delivery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl"
            >
              <input
                placeholder="Street"
                value={address.street}
                onChange={(e) => setAddress("street", e.target.value)}
                className="col-span-2 p-2 border rounded"
              />
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress("city", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => setAddress("phone", e.target.value)}
                className="p-2 border rounded"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* DINE-IN */}
        {orderType === "dine-in" && (
          <input
            placeholder="Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="p-2 border rounded w-full"
          />
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </motion.div>

      {/* RIGHT */}
      <motion.div className="border rounded-xl p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-lg">Order Summary</h2>

        {/* ITEMS */}
        <div className="space-y-2 max-h-40 overflow-auto">
          {cart.map((item, index) => (
            <div
              key={`${item.menuItemId}-${index}`} // ✅ FIXED
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* PRICE */}
        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>₹{delivery.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleOrder}
          disabled={loading || !isValid}
          className="w-full bg-green-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin" />}
          Place Order
        </button>
      </motion.div>
    </div>
  );
}
