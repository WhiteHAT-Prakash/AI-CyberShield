import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatbotApi } from '../../api'
import { getErrorMessage, formatDate } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiSend, FiCpu, FiUser, FiInfo } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'

export default function ChatbotPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { addAlert } = useAlerts()
  const messagesEndRef = useRef(null)

  // Scroll messages log to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load chat history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await chatbotApi.getHistory()
        setMessages(response.data)
      } catch (err) {
        addAlert({ type: 'danger', message: getErrorMessage(err) })
      }
    }
    loadHistory()
  }, [addAlert])

  // Scroll to bottom whenever messages list or loading state updates
  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input, created_at: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await chatbotApi.sendMessage({ message: input })
      const aiMsg = { role: 'assistant', content: response.data.reply, created_at: new Date().toISOString() }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Security Copilot</h1>
        <p className="text-cyber-muted mt-1">
          Chat with an agentic AI security advisor specializing in threat assessments, network security, and compliance.
        </p>
      </div>

      {/* Chat Terminal Interface */}
      <GlassCard className="flex-1 flex flex-col border border-cyber-border/40 overflow-hidden bg-cyber-navy/20">
        
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-cyber-navy/80 border-b border-cyber-border/40 flex items-center justify-between text-xs text-cyber-glow">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-success animate-pulse-slow" />
            <span>AI SEC-COPILOT TERMINAL ONLINE</span>
          </div>
          <span className="font-mono text-cyber-muted">SEC_SESSION_v1.0</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-cyber-muted max-w-sm mx-auto">
              <FiCpu className="text-5xl mb-4 text-cyber-accent animate-pulse-slow" />
              <h3 className="font-bold text-white mb-1">Terminal Initialized</h3>
              <p className="text-xs leading-relaxed">
                Enter your cybersecurity questions. Example: "How do I secure my home router against DNS spoofing?"
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-glow-sm
                  ${msg.role === 'user' ? 'bg-cyber-accent text-white' : 'bg-cyber-purple text-white'}`}
                >
                  {msg.role === 'user' ? <FiUser /> : <FiCpu />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-xl border leading-relaxed text-sm whitespace-pre-wrap
                  ${msg.role === 'user' 
                    ? 'bg-cyber-accent/15 border-cyber-accent/35 text-slate-100 rounded-tr-none' 
                    : 'bg-cyber-navy/60 border-cyber-border/40 text-slate-200 rounded-tl-none'}`}
                >
                  <p>{msg.content}</p>
                  <span className="block text-[9px] text-cyber-muted mt-2 font-mono">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-cyber-purple text-white shrink-0 flex items-center justify-center shadow-glow-sm animate-pulse-slow">
                <FiCpu />
              </div>
              <div className="p-4 rounded-xl border bg-cyber-navy/60 border-cyber-border/40 rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyber-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyber-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-cyber-navy/60 border-t border-cyber-border/40 flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your security question..."
            disabled={loading}
            className="input-field flex-1"
            required
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary flex items-center justify-center px-6"
          >
            <FiSend className="text-base" />
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
