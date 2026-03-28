import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Package, Heart, Settings, Edit3, Star, Clock, CheckCircle, Truck, ChevronRight, Award, LogOut } from 'lucide-react'
import { useStore } from '../store/useStore'
import { MENU_ITEMS, ORDER_HISTORY } from '../data/menu'
import { Link } from 'react-router-dom'

const TABS = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const STATUS_CONFIG = {
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  on_the_way: { label: 'On the Way', color: 'bg-blue-100 text-blue-700', icon: Truck },
  preparing: { label: 'Preparing', color: 'bg-amber-100 text-amber-700', icon: Clock },
}

export default function ProfilePage() {
  const { user, updateUser, wishlist, addToast } = useStore()
  const [activeTab, setActiveTab] = useState('orders')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...user })

  const wishlistItems = MENU_ITEMS.filter(i => wishlist.includes(i.id))

  const saveProfile = () => {
    updateUser(editForm)
    setEditing(false)
    addToast('Profile updated successfully ✓')
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-clay-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          className="card overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="hero-gradient h-32 relative noise-overlay">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #fbbf24, transparent 60%)' }} />
          </div>
          <div className="px-6 pb-6 relative">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-white" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
              </motion.div>
              <div className="flex gap-2 mb-2">
                <button onClick={() => setEditing(v => !v)} className="flex items-center gap-1.5 text-sm text-forest-700 border border-forest-300 px-4 py-2 rounded-xl hover:bg-forest-50 transition-colors font-medium">
                  <Edit3 size={13} /> Edit
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <h2 className="font-display font-bold text-2xl text-forest-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-400 text-xs mt-1">📍 {user.address} · Member since {user.joined}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  [ORDER_HISTORY.length + '', 'Orders'],
                  [wishlist.length + '', 'Saved'],
                  [user.points + '', 'Points'],
                ].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <p className="font-display font-bold text-xl text-forest-900">{val}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Points bar */}
            <div className="mt-4 bg-forest-50 rounded-2xl p-4 flex items-center gap-4">
              <Award size={20} className="text-saffron-500 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-forest-900">{user.points} reward points</span>
                  <span className="text-gray-400">2000 for Gold tier</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-forest-500 to-saffron-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (user.points / 2000) * 100)}%` }}
                    transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit modal */}
        <AnimatePresence>
          {editing && (
            <motion.div
              className="card p-5 mb-5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="font-display font-bold text-forest-900 mb-4">Edit Profile</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[['name', 'Full Name'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address']].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                    <input
                      value={editForm[key]}
                      onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={saveProfile} className="btn-forest">Save Changes</button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-colors">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-6">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-forest-700 text-white shadow-green' : 'text-gray-500 hover:text-forest-700'}`}
                whileTap={{ scale: 0.96 }}
              >
                <Icon size={14} />
                {tab.label}
              </motion.button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {ORDER_HISTORY.map((order, i) => {
                  const statusConfig = STATUS_CONFIG[order.status]
                  const StatusIcon = statusConfig.icon
                  return (
                    <motion.div
                      key={order.id + i}
                      className="card p-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-display font-bold text-forest-900">#{order.id}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                        </div>
                        <span className={`badge ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon size={11} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {order.items.map(item => (
                          <span key={item} className="text-xs bg-clay-100 text-gray-600 px-2.5 py-1 rounded-full">{item}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="font-display font-bold text-forest-900">${order.total.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button className="text-xs text-forest-600 font-medium hover:text-forest-800 transition-colors">View Details</button>
                          <button className="text-xs bg-forest-700 text-white px-3 py-1.5 rounded-full hover:bg-forest-600 transition-colors font-medium">
                            Reorder
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                <Link to="/menu" className="flex items-center justify-center gap-2 text-forest-600 text-sm font-medium py-4 hover:text-forest-800 transition-colors">
                  Browse Menu to Order <ChevronRight size={14} />
                </Link>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="font-display font-bold text-forest-900 mb-1">No saved items yet</p>
                    <p className="text-gray-400 text-sm mb-4">Heart items on the menu to save them here</p>
                    <Link to="/menu" className="btn-forest">Explore Menu</Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        className="card p-4 flex items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-forest-900 text-sm truncate">{item.name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 my-0.5">
                            <Star size={10} className="fill-saffron-400 text-saffron-400" />
                            {item.rating}
                          </div>
                          <p className="font-bold text-forest-800 text-sm">${item.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                {[
                  { title: 'Notifications', description: 'Order updates, promotions, new items', toggle: true, on: true },
                  { title: 'SMS Alerts', description: 'Delivery status via text message', toggle: true, on: false },
                  { title: 'Email Newsletter', description: 'Weekly deals and new menu items', toggle: true, on: true },
                ].map((setting, i) => (
                  <motion.div
                    key={setting.title}
                    className="card p-5 flex items-center justify-between"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div>
                      <p className="font-semibold text-forest-900 text-sm">{setting.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{setting.description}</p>
                    </div>
                    <button className={`relative w-12 h-6 rounded-full transition-colors ${setting.on ? 'bg-forest-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${setting.on ? 'left-7' : 'left-1'}`} />
                    </button>
                  </motion.div>
                ))}

                <motion.button
                  className="w-full card p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} />
                  <span className="font-medium text-sm">Sign Out</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
