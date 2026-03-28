import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Sparkles, Loader2, ChefHat } from 'lucide-react'
import { useStore } from '../store/useStore'
import { MENU_ITEMS } from '../data/menu'

const SYSTEM_PROMPT = `You are "Chef AI", the friendly and knowledgeable virtual chef assistant for DelishDrop restaurant. 

Your personality: warm, enthusiastic about food, helpful, occasionally uses food emojis, concise responses.

Your capabilities:
1. Recommend dishes based on preferences, dietary needs, mood
2. Answer questions about ingredients, allergens, calorie counts
3. Suggest meal combos and pairings
4. Help with table bookings (direct users to the Booking page)
5. Track orders (tell users to check their Profile page)
6. Describe cooking methods and what makes each dish special

Current menu highlights:
${MENU_ITEMS.slice(0, 8).map(i => `- ${i.name} ($${i.price}) — ${i.description}`).join('\n')}

Keep responses under 3 sentences unless explaining something complex. Be conversational and use emojis naturally.`

const QUICK_PROMPTS = [
  "What's your best burger? 🍔",
  "I want something healthy",
  "Surprise me with a combo!",
  "What's spicy today? 🌶️",
]

export default function AIChat() {
  const { chatOpen, setChatOpen, user } = useStore()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey ${user.name.split(' ')[0]}! 👋 I'm Chef AI, your personal food guide at DelishDrop. What are you craving today? I can help you pick the perfect dish, suggest combos, or answer any food questions! 🍽️`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('dd_api_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [chatOpen])

  const saveApiKey = (key) => {
    localStorage.setItem('dd_api_key', key)
    setApiKey(key)
    setShowKeyInput(false)
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return

    if (!apiKey) {
      setShowKeyInput(true)
      return
    }

    const userMsg = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || 'API error')
      }

      const data = await res.json()
      const reply = data.content[0]?.text || "I couldn't process that. Try again!"
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err.message.includes('invalid x-api-key') ? 'Invalid API key. Click ⚙️ to update it.' : 'Something went wrong. Please try again!'}`
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {chatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChatOpen(false)}
          />

          {/* Chat Panel */}
          <motion.div
            className="fixed bottom-6 right-6 z-[110] w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: 580, maxHeight: 'calc(100vh - 3rem)' }}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="hero-gradient p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron-400 rounded-2xl flex items-center justify-center">
                  <ChefHat size={20} className="text-forest-900" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-sm">Chef AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-xs">Always ready to help</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setShowKeyInput(v => !v)}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20"
                  whileTap={{ scale: 0.9 }}
                  title="API Settings"
                >
                  <Sparkles size={14} />
                </motion.button>
                <motion.button
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* API Key Setup */}
            <AnimatePresence>
              {showKeyInput && (
                <motion.div
                  className="bg-amber-50 border-b border-amber-200 p-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <p className="text-xs text-amber-800 font-medium mb-2">🔑 Enter Anthropic API Key</p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="sk-ant-..."
                      className="flex-1 text-xs border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-forest-500"
                      defaultValue={apiKey}
                      onKeyDown={e => e.key === 'Enter' && saveApiKey(e.target.value)}
                    />
                    <button
                      onClick={e => saveApiKey(e.target.previousSibling.value)}
                      className="px-3 py-2 bg-forest-700 text-white text-xs rounded-lg font-medium"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-xs text-amber-700 mt-1.5">Get your key at <span className="underline">console.anthropic.com</span></p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-clay-50">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-forest-700' : 'bg-saffron-400'
                  }`}>
                    {m.role === 'user'
                      ? <User size={13} className="text-white" />
                      : <Bot size={13} className="text-forest-900" />
                    }
                  </div>
                  <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-forest-700 text-white rounded-tr-sm'
                      : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-sm'
                  }`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-7 h-7 rounded-full bg-saffron-400 flex items-center justify-center shrink-0">
                    <Bot size={13} className="text-forest-900" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-forest-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-clay-50 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="shrink-0 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-forest-400 hover:text-forest-700 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-clay-50 rounded-2xl px-4 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask me anything about food..."
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 bg-forest-700 text-white rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.85 }}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
