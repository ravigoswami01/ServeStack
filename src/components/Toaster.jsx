import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Toaster() {
  const { toasts, removeToast } = useStore()
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium pointer-events-auto max-w-xs ${
              t.type === 'error' ? 'bg-red-600 text-white' : 'bg-forest-800 text-white'
            }`}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {t.type === 'error'
              ? <AlertCircle size={16} className="shrink-0" />
              : <CheckCircle size={16} className="shrink-0 text-saffron-400" />
            }
            <span>{t.msg}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2 hover:opacity-70">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
