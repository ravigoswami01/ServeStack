import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Truck, Loader2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useOrderStore } from "../store/useOrderStore";

const STATUS_FLOW = [
  { key: "pending", label: "Order Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: Clock },
  { key: "on_the_way", label: "On the Way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderId } = useParams();

  const { addMultipleToCart } = useCartStore();
  const { getOrder, order, loading, error } = useOrderStore();

  useEffect(() => {
    const id = orderId || state?.order?._id;
    if (id) {
      getOrder(id);
    }
  }, [orderId, state?.order, getOrder]);

  if (loading && !order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 size={48} className="text-green-600 animate-spin" />
        <p className="mt-4 text-gray-600 font-semibold">
          Fetching your order...
        </p>
      </div>
    );
  }

  const orderData = order || state?.order;

  if (!orderData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Truck size={48} className="mx-auto text-gray-300" />
          <p className="text-lg font-semibold text-gray-700">No Order Found</p>
          <p className="text-sm text-gray-500">
            {error || "Please place an order to track it"}
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex =
    STATUS_FLOW.findIndex((s) => s.key === orderData.status) || 0;

  const handleReorder = () => {
    if (!orderData?.items?.length) return;

    const mappedItems = orderData.items.map((item) => ({
      menuItemId: item.menuItemId || item._id || item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity || 1,
      restaurantId: orderData.restaurantId,
    }));

    addMultipleToCart(mappedItems);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>

          <h1 className="text-xl font-bold">
            Order #{orderData?._id?.slice(-6) || "XXXX"}
          </h1>
        </div>

        {/* STATUS TRACKER */}
        <motion.div
          className="bg-white p-5 rounded-xl shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="font-semibold mb-4">
            Order Status: {orderData.status}
          </h2>

          <div className="flex justify-between items-center">
            {STATUS_FLOW.map((step, index) => {
              const Icon = step.icon;
              const active = index <= currentStepIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center flex-1"
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      active ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <p className="text-xs mt-2 text-center">{step.label}</p>

                  {/* Line */}
                  {index < STATUS_FLOW.length - 1 && (
                    <div className="h-1 w-full bg-gray-200 mt-2">
                      <div
                        className={`h-1 ${
                          index < currentStepIndex ? "bg-green-600" : ""
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ITEMS */}
        <motion.div
          className="bg-white p-5 rounded-xl shadow-sm space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="font-semibold">
            Items ({orderData?.items?.length || 0})
          </h2>

          {orderData?.items?.length > 0 ? (
            orderData.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-3">
                <img
                  src={item?.image || "https://via.placeholder.com/60"}
                  alt={item?.name}
                  className="w-14 h-14 rounded object-cover"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/60")
                  }
                />

                <div className="flex-1">
                  <p className="font-medium">{item?.name || "Item"}</p>

                  <p className="text-sm text-gray-500">
                    {item?.quantity || 1} × ₹{item?.price || 0}
                  </p>
                </div>

                <p className="font-medium">
                  ₹{((item?.quantity || 1) * (item?.price || 0)).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No items in this order</p>
          )}
        </motion.div>

        {/* BILL SUMMARY */}
        <motion.div
          className="bg-white p-5 rounded-xl shadow-sm space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="font-semibold">Bill Details</h2>

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{orderData?.subtotal?.toFixed(2) || "0.00"}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>₹{orderData?.deliveryFee || 0}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{orderData?.totalAmount?.toFixed(2) || "0.00"}</span>
          </div>
        </motion.div>

        {/* ADDRESS / TABLE */}
        <motion.div
          className="bg-white p-5 rounded-xl shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="font-semibold mb-2">
            {orderData?.orderType === "delivery"
              ? "Delivery Address"
              : "Table Info"}
          </h2>

          {orderData?.orderType === "delivery" ? (
            <div>
              <p className="text-sm text-gray-600">
                {orderData?.deliveryAddress?.street || "N/A"},{" "}
                {orderData?.deliveryAddress?.city || ""}
              </p>
              {orderData?.deliveryAddress?.phone && (
                <p className="text-sm text-gray-600 mt-2">
                  📱 {orderData.deliveryAddress.phone}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Table #{orderData?.tableNumber || "N/A"}
            </p>
          )}
        </motion.div>

        {/* ORDER TIME */}
        {orderData?.createdAt && (
          <motion.div
            className="bg-white p-5 rounded-xl shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="font-semibold mb-2">Order Time</h2>
            <p className="text-sm text-gray-600">
              {new Date(orderData.createdAt).toLocaleString()}
            </p>
          </motion.div>
        )}

        {/* REORDER BUTTON */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleReorder}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Reorder Items
        </motion.button>
      </div>
    </div>
  );
}
