import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Clock, ChevronDown, Zap } from 'lucide-react'
import MenuItemCard from '../components/MenuItemCard'
import { MENU_ITEMS, TOP_PICKS, FLASH_DEALS, PROMOS, CATEGORY_CARDS } from '../data/menu'
import { useStore } from '../store/useStore'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: 'spring', stiffness: 120 } }) }

function FlashDealItem({ item }) {
  const { addToCart, addToast } = useStore()
  const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 30
  return (
    <motion.div
      className="card flex items-center gap-4 p-4"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative shrink-0">
        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
        <span className="absolute -top-1 -left-1 badge bg-ember-500 text-white text-[10px]">{discount}%</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm text-forest-900 truncate">{item.name}</p>
        <div className="flex items-center gap-1 my-0.5">
          <Star size={10} className="fill-saffron-400 text-saffron-400" />
          <span className="text-xs text-gray-500">{item.rating} • {item.reviews} reviews</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-forest-800">${item.price}</span>
            {item.originalPrice && <span className="text-xs text-gray-400 line-through">${item.originalPrice}</span>}
          </div>
        </div>
      </div>
      <button
        onClick={() => { addToCart(item); addToast(`${item.name} added! 🛒`) }}
        className="shrink-0 text-xs bg-forest-700 text-white px-3 py-1.5 rounded-full hover:bg-forest-600 transition-colors font-medium"
      >
        Add
      </button>
    </motion.div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden pt-24 pb-16 noise-overlay">
        {/* Decorative shapes */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-forest-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-saffron-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[520px]">
          {/* Left */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="w-2 h-2 bg-saffron-400 rounded-full animate-pulse" />
              Fast Delivery in 20–35 mins
            </motion.div>

            <motion.h1
              className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] mb-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 120 }}
            >
              Delicious food<br />
              <span className="text-saffron-400">at your</span><br />
              doorstep
            </motion.h1>

            <motion.p
              className="text-white/60 text-base mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Whether you're craving a quick bite or culinary adventures, we're here to inspire your next meal.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/menu" className="btn-primary flex items-center gap-2">
                Explore Menu <ArrowRight size={16} />
              </Link>
              <Link to="/booking" className="btn-ghost flex items-center gap-2">
                Book a Table
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {[['1500+', 'Happy Customers'], ['4.8★', 'Average Rating'], ['20 min', 'Avg. Delivery']].map(([val, label]) => (
                <div key={label}>
                  <p className="font-display font-bold text-white text-lg">{val}</p>
                  <p className="text-white/50 text-xs">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — hero images */}
          <div className="relative flex justify-center items-center">
            <motion.div
              className="w-72 h-72 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"
                alt="Hero burger"
                className="w-full h-full object-cover animate-float"
              />
            </motion.div>
            {/* Floating card */}
            <motion.div
              className="absolute top-6 -right-4 bg-white rounded-2xl shadow-card-hover px-4 py-3 flex items-center gap-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&q=80" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-forest-900">Margherita DOP</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={9} className="fill-saffron-400 text-saffron-400" />)}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-10 -left-6 bg-saffron-400 rounded-2xl shadow-amber px-4 py-2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-forest-900 font-display font-bold text-sm">Free Delivery</p>
              <p className="text-forest-800 text-xs">On orders above $25</p>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center mt-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown className="text-white/30" size={22} />
        </motion.div>
      </section>

      {/* ── Promo Banners ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-5">
          {PROMOS.map((promo, i) => (
            <motion.div
              key={promo.id}
              className={`${promo.theme} rounded-3xl p-6 relative overflow-hidden cursor-pointer group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className={promo.textColor}>
                <p className="text-xs font-semibold opacity-70 mb-1">{promo.subtitle}</p>
                <p className="font-display font-extrabold text-xl leading-tight mb-2">{promo.title}</p>
                <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm font-bold mb-4">
                  Up to {promo.discount} OFF
                </div>
                <br />
                <Link to="/menu" className="inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all">
                  Order Now <ArrowRight size={14} />
                </Link>
              </div>
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute right-4 bottom-0 w-24 h-24 object-cover rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Top Picks ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.p
              className="text-saffron-500 font-semibold text-sm mb-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              🔥 Chef's Selection
            </motion.p>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Top Picks
            </motion.h2>
          </div>
          <Link to="/menu" className="flex items-center gap-1 text-forest-600 text-sm font-semibold hover:text-forest-800 transition-colors">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOP_PICKS.map((item, i) => <MenuItemCard key={item.id} item={item} index={i} />)}
        </div>
      </section>

      {/* ── Explore by Category ───────────────── */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p
                className="text-forest-500 font-semibold text-sm mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Browse by Type
              </motion.p>
              <motion.h2
                className="section-title mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Explore Delicious<br />Cuisine by Category
              </motion.h2>
              <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
                Our mission is to connect food lovers with their favorite cuisines.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORY_CARDS.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    className="bg-white rounded-2xl p-4 shadow-card cursor-pointer group"
                    whileHover={{ y: -3, shadow: 'card-hover' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => {}}
                  >
                    <span className="text-2xl block mb-1">{cat.emoji}</span>
                    <p className="font-display font-semibold text-sm text-forest-900">{cat.label}</p>
                    <p className="text-xs text-gray-400">{cat.count}</p>
                  </motion.div>
                ))}
              </div>
              <Link to="/menu" className="btn-forest inline-flex items-center gap-2 mt-6">
                View All Categories <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <motion.img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80"
                alt="Category showcase"
                className="w-full h-80 object-cover rounded-3xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card-hover p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-10 h-10 bg-saffron-400 rounded-xl flex items-center justify-center">
                  <Zap size={18} className="text-forest-900" />
                </div>
                <div>
                  <p className="font-display font-bold text-forest-900 text-sm">Express Delivery</p>
                  <p className="text-xs text-gray-400">Ready in 20 minutes</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Flash Deals ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Zap size={16} className="text-ember-500 fill-ember-500" />
              <p className="text-ember-500 font-semibold text-sm">Limited Time</p>
            </motion.div>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Flash Deals: Ending Soon!
            </motion.h2>
          </div>
          <div className="flex items-center gap-1.5 bg-ember-500 text-white text-sm font-bold px-4 py-2 rounded-full">
            <Clock size={14} />
            <span>01:45:32</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {MENU_ITEMS.filter(i => i.originalPrice || i.rating >= 4.8).slice(0, 6).map((item, i) => (
            <FlashDealItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────── */}
      <section className="hero-gradient py-16 relative overflow-hidden noise-overlay">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fbbf24 0%, transparent 60%)' }} />
        <div className="max-w-2xl mx-auto text-center px-6 relative">
          <motion.h2
            className="font-display text-4xl font-extrabold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready for your next meal?
          </motion.h2>
          <motion.p
            className="text-white/60 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Order now and get free delivery on your first order above ₹499
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/menu" className="btn-primary">Start Ordering</Link>
            <Link to="/booking" className="btn-ghost">Reserve a Table</Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
