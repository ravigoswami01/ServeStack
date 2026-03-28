import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Heart,
  Settings,
  Edit3,
  Star,
  Clock,
  CheckCircle,
  Truck,
  ChevronRight,
  Award,
  LogOut,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { useStore } from "../store/useStore";
import { MENU_ITEMS, ORDER_HISTORY } from "../data/menu";
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

  const [activeTab, setActiveTab] = useState("orders");
  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  /* ================= SYNC USER ================= */
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

  /* ================= SAFETY ================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  /* ================= HANDLERS ================= */
  const saveProfile = async () => {
    try {
      await updateProfile(editForm);
      setEditing(false);
      addToast("Profile updated successfully ✓");
    } catch (err) {
      console.error(err);
      addToast("Update failed ❌");
    }
  };

  const wishlistItems = MENU_ITEMS.filter((i) => wishlist.includes(i.id));

  return (
    <div className="min-h-screen pt-20 pb-12 bg-clay-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* ================= PROFILE HEADER ================= */}
        <motion.div
          className="card overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="hero-gradient h-32 relative noise-overlay" />

          <div className="px-6 pb-6 relative">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <img
                  src={user.avatar || "https://via.placeholder.com/100"}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
                />
              </motion.div>

              <button
                onClick={() => setEditing((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-forest-700 border px-4 py-2 rounded-xl"
              >
                <Edit3 size={13} /> Edit
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <h2 className="font-bold text-2xl text-forest-900">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-400 text-xs mt-1">
                  📍 {user.address || "No address"} · Member since{" "}
                  {user.joined || "2024"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  [ORDER_HISTORY.length, "Orders"],
                  [wishlist.length, "Saved"],
                  [user.points || 0, "Points"],
                ].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <p className="font-bold text-xl">{val}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== POINTS BAR ===== */}
            <div className="mt-4 bg-gray-100 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{user.points || 0} points</span>
                <span>2000 for Gold</span>
              </div>
              <div className="bg-gray-300 h-2 rounded-full">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      100,
                      ((user.points || 0) / 2000) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= EDIT PROFILE ================= */}
        <AnimatePresence>
          {editing && (
            <motion.div className="card p-5 mb-5">
              <h3 className="font-bold mb-4">Edit Profile</h3>

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
                    placeholder={field}
                    className="input-field"
                  />
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={saveProfile} className="btn-forest">
                  Save Changes
                </button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= TABS ================= */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab.id ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB CONTENT ================= */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}>
            {/* ===== ORDERS ===== */}
            {activeTab === "orders" &&
              ORDER_HISTORY.map((order) => {
                const status = STATUS_CONFIG[order.status];
                const Icon = status.icon;

                return (
                  <div key={order.id} className="card p-4 mb-3">
                    <p className="font-bold">#{order.id}</p>
                    <span className={status.color}>
                      <Icon size={12} /> {status.label}
                    </span>
                    <p>₹{order.total}</p>
                  </div>
                );
              })}

            {/* ===== WISHLIST ===== */}
            {activeTab === "wishlist" &&
              wishlistItems.map((item) => (
                <div key={item.id} className="card p-3 flex gap-3">
                  <img src={item.image} className="w-16 h-16" />
                  <div>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}

            {/* ===== SETTINGS ===== */}
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

        {/* ===== MENU LINK ===== */}
        <Link to="/menu" className="block text-center mt-6">
          Browse Menu <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
