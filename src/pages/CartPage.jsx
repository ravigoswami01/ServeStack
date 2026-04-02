import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCartStore } from "../store/CartStore";

const DELIVERY_FEE = 40;

export default function CartPage() {
  const {
    cart,
    loading,
    fetchCart,
    updateQty,
    removeFromCart,
    clearCart,
    applyPromo,
    appliedPromo,
    discount,
    finalTotal,
    promoLoading,
  } = useCartStore();

  const [promo, setPromo] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= CALCULATIONS ================= */
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = appliedPromo ? finalTotal : subtotal + delivery;

  /* ================= APPLY PROMO ================= */
  const handleApply = async () => {
    const res = await applyPromo(promo.trim().toUpperCase());

    if (!res.success) {
      setError(res.message);
    } else {
      setError("");
    }
  };

  /* ================= IMAGE FIX ================= */
  const getImage = (item) => {
    if (!item.image) return "/fallback.png"; // fallback

    // if already full URL
    if (item.image.startsWith("http")) return item.image;

    // if relative
    return `${BASE_URL}${item.image}`;
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!cart.length) {
    return (
      <h2 className="text-center mt-20 text-lg font-semibold">Cart is empty</h2>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
      {/* ================= ITEMS ================= */}
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
          <div
            key={item.menuItemId}
            className="flex gap-4 border p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* 🔥 IMAGE */}
            <img
              src={getImage(item)}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => (e.target.src = "/fallback.png")}
            />

            {/* DETAILS */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-500 text-sm">₹{item.price.toFixed(2)}</p>

              <p className="text-sm mt-1">
                Total: ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeFromCart(item.menuItemId)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
                <button
                  onClick={() => updateQty(item.menuItemId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  onClick={() => updateQty(item.menuItemId, item.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="border p-5 rounded-xl space-y-4 shadow-sm sticky top-10 h-fit">
        <h2 className="font-bold text-lg">Order Summary</h2>

        {/* PROMO */}
        <div className="flex gap-2">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Enter promo code"
            className="border p-2 w-full rounded-lg"
          />
          <button
            onClick={handleApply}
            disabled={promoLoading}
            className="bg-black text-white px-4 rounded-lg"
          >
            {promoLoading ? "..." : "Apply"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {appliedPromo && (
          <p className="text-green-600 text-sm">✅ {appliedPromo} applied</p>
        )}

        {/* PRICE */}
        <div className="space-y-2 border-t pt-3 text-sm">
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

        {/* ACTIONS */}
        <button
          onClick={() =>
            navigate("/checkout", {
              state: { total, subtotal, discount, delivery },
            })
          }
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          Proceed to Checkout
        </button>

        <button onClick={clearCart} className="text-red-500 text-sm w-full">
          Clear Cart
        </button>
      </div>
    </div>
  );
}
