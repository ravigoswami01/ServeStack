import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Users, MapPin, CheckCircle, ChevronRight, Utensils } from 'lucide-react'
import { useStore } from '../store/useStore'

const TIME_SLOTS = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM']
const SPECIAL = ['Anniversary', 'Birthday', 'Business Dinner', 'Date Night', 'Family Gathering', 'None']
const TABLES = [
  { id: 'indoor-cozy', label: 'Indoor Cozy', description: 'Intimate corner booth with warm lighting', icon: '🕯️', max: 4 },
  { id: 'outdoor-garden', label: 'Garden Terrace', description: 'Open-air dining with garden views', icon: '🌿', max: 8 },
  { id: 'private-room', label: 'Private Room', description: 'Exclusive space for special occasions', icon: '🎩', max: 12 },
  { id: 'bar-counter', label: 'Chef\'s Counter', description: 'Watch the chefs work their magic', icon: '👨‍🍳', max: 6 },
]

const STEPS = ['Date & Guests', 'Select Table', 'Your Details', 'Confirm']

export default function BookingPage() {
  const { user, addToast } = useStore()
  const [step, setStep] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [form, setForm] = useState({
    date: '',
    time: '',
    guests: 2,
    tableType: '',
    name: user.name,
    phone: user.phone,
    email: user.email,
    special: 'None',
    requests: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const canProceed = () => {
    if (step === 0) return form.date && form.time && form.guests
    if (step === 1) return form.tableType
    if (step === 2) return form.name && form.phone && form.email
    return true
  }

  const handleConfirm = async () => {
    await new Promise(r => setTimeout(r, 1500))
    setConfirmed(true)
    addToast('🎉 Table booked successfully!')
  }

  if (confirmed) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-6 bg-clay-50">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: 2, duration: 0.5 }}
          >
            <CheckCircle size={48} className="text-forest-600" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-forest-900 mb-3">Booking Confirmed! 🎉</h2>
          <p className="text-gray-500 mb-6">
            Your table for <strong>{form.guests} guests</strong> is reserved on <strong>{form.date}</strong> at <strong>{form.time}</strong>.
            We'll send a confirmation to <strong>{form.email}</strong>.
          </p>
          <div className="bg-white rounded-2xl p-5 shadow-card mb-6 text-left space-y-3">
            {[
              ['📅 Date', form.date],
              ['⏰ Time', form.time],
              ['👥 Guests', form.guests],
              ['🪑 Table', TABLES.find(t => t.id === form.tableType)?.label],
              ['✨ Occasion', form.special],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-forest-900">{val}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setConfirmed(false); setStep(0); setForm(f => ({ ...f, date: '', time: '', tableType: '' })) }} className="btn-forest w-full">
            Book Another Table
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-clay-50">
      {/* Hero */}
      <div className="hero-gradient py-12 px-6 relative overflow-hidden noise-overlay">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p className="text-saffron-400 font-semibold text-sm mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            🍽️ Reserve your experience
          </motion.p>
          <motion.h1
            className="font-display text-4xl font-extrabold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Book a Table
          </motion.h1>
          <p className="text-white/60 text-sm">Secure your perfect dining moment</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex flex-col items-center`}>
                <motion.div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-forest-700 text-white' : i === step ? 'bg-saffron-400 text-forest-900 shadow-amber' : 'bg-gray-200 text-gray-400'
                  }`}
                  animate={i === step ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </motion.div>
                <span className={`text-[10px] mt-1 font-medium ${i === step ? 'text-forest-700' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mx-1 mb-4 transition-colors ${i < step ? 'bg-forest-700' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="card p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {/* Step 0: Date & Guests */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-display font-bold text-xl text-forest-900 mb-4">When are you visiting?</h2>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1.5">
                    <Calendar size={14} className="text-forest-600" /> Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1.5">
                    <Clock size={14} className="text-forest-600" /> Select Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(t => (
                      <motion.button
                        key={t}
                        onClick={() => set('time', t)}
                        className={`py-2 px-1 rounded-xl text-xs font-medium transition-all ${form.time === t ? 'bg-forest-700 text-white shadow-green' : 'bg-gray-100 text-gray-600 hover:bg-forest-50 hover:text-forest-700'}`}
                        whileTap={{ scale: 0.93 }}
                      >
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1.5">
                    <Users size={14} className="text-forest-600" /> Number of Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => set('guests', Math.max(1, form.guests - 1))} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-forest-700 hover:border-forest-500 transition-colors text-xl">-</button>
                    <span className="font-display font-bold text-2xl text-forest-900 w-8 text-center">{form.guests}</span>
                    <button onClick={() => set('guests', Math.min(12, form.guests + 1))} className="w-10 h-10 bg-forest-700 text-white rounded-full flex items-center justify-center hover:bg-forest-600 transition-colors text-xl">+</button>
                    <span className="text-sm text-gray-400">guests</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Special Occasion?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SPECIAL.map(s => (
                      <button
                        key={s}
                        onClick={() => set('special', s)}
                        className={`py-2 px-2 rounded-xl text-xs font-medium transition-all ${form.special === s ? 'bg-saffron-400 text-forest-900 shadow-amber' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Table Type */}
            {step === 1 && (
              <div>
                <h2 className="font-display font-bold text-xl text-forest-900 mb-4">Choose your table</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {TABLES.filter(t => t.max >= form.guests).map(table => (
                    <motion.button
                      key={table.id}
                      onClick={() => set('tableType', table.id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all ${form.tableType === table.id ? 'border-forest-700 bg-forest-50' : 'border-gray-200 hover:border-forest-300 bg-white'}`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-3xl block mb-2">{table.icon}</span>
                      <p className="font-display font-bold text-forest-900 text-sm">{table.label}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{table.description}</p>
                      <p className="text-xs text-forest-600 font-medium mt-2">Up to {table.max} guests</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-xl text-forest-900 mb-4">Your details</h2>
                {[
                  ['name', 'Full Name', 'text'],
                  ['phone', 'Phone Number', 'tel'],
                  ['email', 'Email Address', 'email'],
                ].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={e => set(key, e.target.value)}
                      className="input-field"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Special Requests</label>
                  <textarea
                    value={form.requests}
                    onChange={e => set('requests', e.target.value)}
                    placeholder="Dietary restrictions, seating preferences, etc."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div>
                <h2 className="font-display font-bold text-xl text-forest-900 mb-5">Confirm Reservation</h2>
                <div className="space-y-3 mb-6">
                  {[
                    ['📅 Date', form.date],
                    ['⏰ Time', form.time],
                    ['👥 Guests', `${form.guests} guests`],
                    ['🪑 Table', TABLES.find(t => t.id === form.tableType)?.label],
                    ['✨ Occasion', form.special],
                    ['📞 Contact', `${form.name} · ${form.phone}`],
                    ...(form.requests ? [['💬 Requests', form.requests]] : []),
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-forest-900 max-w-[55%] text-right">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3 mb-6">
                  <Utensils size={16} className="text-forest-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-forest-700 leading-relaxed">
                    Free cancellation up to 2 hours before your reservation. We'll send a reminder 24 hours before.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          <motion.button
            onClick={step < 3 ? () => setStep(s => s + 1) : handleConfirm}
            disabled={!canProceed()}
            className="btn-forest flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.97 }}
          >
            {step < 3 ? 'Continue' : 'Confirm Booking'}
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
