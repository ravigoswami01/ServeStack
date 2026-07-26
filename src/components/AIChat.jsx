import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, ChefHat } from "lucide-react";
import { useStore } from "../store/useStore";
import apiClient from "../API/axios";
import { endpoints } from "../API/ApiEndPoint";

const QUICK_PROMPTS = [
  "What's your best burger? 🍔",
  "I want something healthy",
  "Surprise me with a combo!",
  "What's spicy today? 🌶️",
];

export default function AIChat() {
  const { chatOpen, setChatOpen, user } = useStore();
  const userName = user?.name ? user.name.split(" ")[0] : "there";
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hey ${userName}! 👋 I'm Chef AI, your personal food guide at DelishDrop. What are you craving today? I can help you pick the perfect dish, suggest combos, or answer any food questions! 🍽️`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [chatOpen]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await apiClient.post(endpoints.ai.chat, {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const reply =
        res?.reply || res?.message || "I couldn't process that. Try again!";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("AI Chat error:", err);
      const errorMsg =
        typeof err === "string"
          ? err
          : err?.message || err?.error || "Something went wrong. Please try again!";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMsg}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
            style={{ height: 580, maxHeight: "calc(100vh - 3rem)" }}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="hero-gradient p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron-400 rounded-2xl flex items-center justify-center">
                  <ChefHat size={20} className="text-forest-900" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-sm">
                    Chef AI
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-xs">
                      Always ready to help
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-clay-50">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-forest-700" : "bg-saffron-400"
                      }`}
                  >
                    {m.role === "user" ? (
                      <User size={13} className="text-white" />
                    ) : (
                      <Bot size={13} className="text-forest-900" />
                    )}
                  </div>
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                      ? "bg-forest-700 text-white rounded-tr-sm"
                      : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-sm"
                      }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-7 h-7 rounded-full bg-saffron-400 flex items-center justify-center shrink-0">
                    <Bot size={13} className="text-forest-900" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-forest-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.15,
                        }}
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
                {QUICK_PROMPTS.map((p) => (
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
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  placeholder="Ask me anything about food..."
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 bg-forest-700 text-white rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.85 }}
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
