import { motion } from 'framer-motion'
import { Heart, Plus, Clock, Flame, Star } from 'lucide-react'
import { useStore } from '../store/useStore'

const BADGE_STYLES = {
  bestseller: 'bg-saffron-400 text-forest-900',
  spicy: 'bg-red-500 text-white',
  new: 'bg-blue-500 text-white',
  premium: 'bg-purple-600 text-white',
  healthy: 'bg-emerald-500 text-white',
  popular: 'bg-orange-500 text-white',
  'fan favorite': 'bg-pink-500 text-white',
}

export default function MenuItemCard({ item, index = 0 }) {
  const { addToCart, toggleWishlist, wishlist, addToast } = useStore()
  const isWished = wishlist.includes(item.id)

  const handleAdd = () => {
    addToCart(item)
    addToast(`${item.name} added to cart 🛒`)
  }

  return (
    <motion.div
      className="card group relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 150 }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden rounded-t-2xl bg-gray-100">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4 }}
        />
        {item.badge && (
          <span className={`badge absolute top-3 left-3 ${BADGE_STYLES[item.badge] || 'bg-gray-700 text-white'} capitalize shadow-lg`}>
            {item.badge}
          </span>
        )}
        {item.originalPrice && (
          <span className="badge absolute top-3 right-3 bg-ember-500 text-white shadow-lg">
            -{Math.round((1 - item.price / item.originalPrice) * 100)}%
          </span>
        )}
        <motion.button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id) }}
          className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
          whileTap={{ scale: 0.85 }}
        >
          <Heart
            size={15}
            className={isWished ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-semibold text-forest-900 text-sm leading-snug flex-1 pr-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star size={12} className="fill-saffron-400 text-saffron-400" />
            <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{item.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {item.time} min
          </span>
          <span className="flex items-center gap-1">
            <Flame size={11} /> {item.cal} cal
          </span>
          <span className="text-gray-300">({item.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-forest-800 text-base">${item.price}</span>
            {item.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1">${item.originalPrice}</span>
            )}
          </div>
          <motion.button
            onClick={handleAdd}
            className="w-8 h-8 bg-forest-700 text-white rounded-full flex items-center justify-center shadow-green hover:bg-forest-600 transition-colors"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
          >
            <Plus size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
