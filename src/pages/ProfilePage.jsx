import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Heart,
  Settings,
  Edit3,
  Clock,
  CheckCircle,
  Truck,
  ChevronRight,
  LogOut,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { useOrderStore } from "../store/useOrderStore";
import { MENU_ITEMS } from "../data/menu";
import { Link } from "react-router-dom";

/* ================= TABS ================= */
const TABS = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

/* ================= STATUS ================= */
const STATUS_CONFIG = {
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  on_the_way: {
    label: "On the Way",
    color: "bg-blue-100 text-blue-700",
    icon: Truck,
  },
  preparing: {
    label: "Preparing",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
};

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const { wishlist, addToast } = useStore();

  const { orders, fetchOrders, loadingOrders } = useOrderStore();

  const [activeTab, setActiveTab] = useState("orders");
  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const saveProfile = async () => {
    try {
      await updateProfile(editForm);
      setEditing(false);
      addToast("Profile updated successfully ✓");
    } catch {
      addToast("Update failed ❌");
    }
  };

  const wishlistItems = MENU_ITEMS.filter((i) => wishlist.includes(i.id));

  return (
    <div className="min-h-screen pt-20 pb-12 bg-clay-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* HEADER */}
        <motion.div
          className="card overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="hero-gradient h-32" />

          <div className="px-6 pb-6 -mt-12">
            <div className="flex items-end justify-between mb-4">
              <img
                src={user.avatar || "https://via.placeholder.com/100"}
                className="w-24 h-24 rounded-2xl border-4 border-white"
              />

              <button
                onClick={() => setEditing((v) => !v)}
                className="flex items-center gap-1 text-sm border px-4 py-2 rounded-xl"
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>

            <h2 className="font-bold text-2xl">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </motion.div>

        {/* EDIT */}
        <AnimatePresence>
          {editing && (
            <motion.div className="card p-5 mb-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {["name", "email", "phone", "address"].map((field) => (
                  <input
                    key={field}
                    value={editForm[field]}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        [field]: e.target.value,
                      })
                    }
                    className="p-2 border rounded"
                  />
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveProfile}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  activeTab === tab.id ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}>
            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-3">
                {loadingOrders ? (
                  <p className="text-gray-500">Loading orders...</p>
                ) : orders?.length ? (
                  orders.map((order) => {
                    const status =
                      STATUS_CONFIG[order.status] || STATUS_CONFIG.preparing;
                    const Icon = status.icon;

                    return (
                      <div
                        key={order._id}
                        className="card p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold">#{order._id.slice(-6)}</p>

                          <div
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded mt-1 ${status.color}`}
                          >
                            <Icon size={12} />
                            {status.label}
                          </div>

                          <p className="text-sm text-gray-500 mt-1">
                            {order.items?.length} items
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{order.totalAmount?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No orders found</p>
                )}
              </div>
            )}

            {/* WISHLIST */}
            {activeTab === "wishlist" &&
              wishlistItems.map((item) => (
                <div key={item.id} className="card p-3 flex gap-3">
                  <img
                    src={item.image}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <button
                onClick={logout}
                className="text-red-500 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        <Link to="/menu" className="block text-center mt-6">
          Browse Menu <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
