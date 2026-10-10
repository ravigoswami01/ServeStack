import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Heart,
  Settings,
  Edit3,
  Clock,
  CheckCircle2,
  Truck,
  ChevronRight,
  LogOut,
  MapPin,
  Phone,
  Mail,
  User,
  X,
  Check,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { useOrderStore } from "../store/useOrderStore";
import { MENU_ITEMS } from "../data/menu";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";

const TABS = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

const STATUS_CONFIG = {
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: CheckCircle2,
  },
  on_the_way: {
    label: "On the way",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    icon: Truck,
  },
  preparing: {
    label: "Preparing",
    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: Clock,
  },
};

const FIELDS = [
  { key: "name", label: "Full name", icon: User, type: "text" },
  { key: "email", label: "Email address", icon: Mail, type: "email" },
  { key: "phone", label: "Phone number", icon: Phone, type: "tel" },
  { key: "address", label: "Delivery address", icon: MapPin, type: "text" },
];

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-gray-200 bg-white/60">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={22} className="text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>
      {action}
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-5 w-28 bg-gray-200 rounded-full" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
              <div className="h-3 w-20 bg-gray-100 rounded ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const { wishlist, toggleWishlist, addToast } = useStore();
  const { orders, fetchOrders, loadingOrders } = useOrderStore();

  const [activeTab, setActiveTab] = useState("orders");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
  }, [fetchOrders]);

  const wishlistItems = useMemo(
    () => MENU_ITEMS.filter((item) => wishlist.includes(item.id)),
    [wishlist]
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clay-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(editForm);
      setEditing(false);
      addToast("Profile updated successfully");
    } catch {
      addToast("Couldn't update your profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setEditing(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-clay-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          className="card overflow-hidden mb-6 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="hero-gradient h-28 sm:h-32" />

          <div className="px-5 sm:px-8 pb-6 -mt-12 sm:-mt-14">
            <div className="flex items-end justify-between mb-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-white bg-gray-900 text-white flex items-center justify-center text-2xl font-semibold shadow-md">
                  {initials(user.name) || "U"}
                </div>
              )}

              <button
                onClick={() => (editing ? cancelEdit() : setEditing(true))}
                className="flex items-center gap-1.5 text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                {editing ? <X size={14} /> : <Edit3 size={14} />}
                {editing ? "Cancel" : "Edit profile"}
              </button>
            </div>

            <h2 className="font-bold text-2xl text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>

            {(user.phone || user.address) && (
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-gray-500">
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} /> {user.phone}
                  </span>
                )}
                {user.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {user.address}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="card p-5 sm:p-6 mb-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Edit your details
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {FIELDS.map(({ key, label, icon: Icon, type }) => (
                    <label key={key} className="block">
                      <span className="text-xs font-medium text-gray-500 mb-1.5 block">
                        {label}
                      </span>
                      <div className="relative">
                        <Icon
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type={type}
                          value={editForm[key]}
                          onChange={(e) =>
                            setEditForm({ ...editForm, [key]: e.target.value })
                          }
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                          placeholder={label}
                        />
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    {saving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        Save changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
                  active
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={15} />
                {tab.label}
                {tab.id === "wishlist" && wishlistItems.length > 0 && (
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="profile-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-gray-900 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "orders" &&
              (loadingOrders ? (
                <OrderSkeleton />
              ) : orders?.length ? (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const status =
                      STATUS_CONFIG[order.status] || STATUS_CONFIG.preparing;
                    const Icon = status.icon;

                    return (
                      <div
                        key={order._id}
                        className="card p-4 sm:p-5 flex items-center justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </p>

                          <div
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mt-2 ${status.color}`}
                          >
                            <Icon size={12} />
                            {status.label}
                          </div>

                          <p className="text-sm text-gray-500 mt-2">
                            {order.items?.length}{" "}
                            {order.items?.length === 1 ? "item" : "items"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{order.totalAmount?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short", year: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Package}
                  title="No orders yet"
                  description="Once you place an order, you'll be able to track it here."
                  action={
                    <Link
                      to="/menu"
                      className="mt-4 text-sm font-medium text-white bg-gray-900 hover:bg-black px-4 py-2 rounded-xl transition-colors"
                    >
                      Browse the menu
                    </Link>
                  }
                />
              ))}

            {activeTab === "wishlist" &&
              (wishlistItems.length ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="card p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          ₹{item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleWishlist?.(item.id)}
                        aria-label={`Remove ${item.name} from wishlist`}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Heart}
                  title="Your wishlist is empty"
                  description="Tap the heart on any dish to save it here for later."
                  action={
                    <Link
                      to="/menu"
                      className="mt-4 text-sm font-medium text-white bg-gray-900 hover:bg-black px-4 py-2 rounded-xl transition-colors"
                    >
                      Discover dishes
                    </Link>
                  }
                />
              ))}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="card p-5 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Account
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage how you sign in and receive updates.
                  </p>
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-700">Email</span>
                      <span className="text-sm text-gray-400">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-700">Phone</span>
                      <span className="text-sm text-gray-400">
                        {user.phone || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card p-5 sm:p-6 border border-red-100">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Session
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Sign out of your account on this device.
                  </p>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-200 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <Link
          to="/menu"
          className="group flex items-center justify-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mt-8 transition-colors"
        >
          <ShoppingBag size={14} />
          Browse menu
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}