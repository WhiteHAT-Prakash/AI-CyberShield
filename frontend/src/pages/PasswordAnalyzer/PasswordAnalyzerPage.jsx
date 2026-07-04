import { useState } from 'react'
import { motion } from 'framer-motion'
import { passwordApi } from '../../api'
import { getErrorMessage, getPasswordStrengthColor } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiLock, FiAlertCircle, FiCheck, FiInfo } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'

export default function PasswordAnalyzerPage() {
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { addAlert } = useAlerts()

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      addAlert({ type: 'warning', message: 'Please enter a password to analyze.' })
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const response = await passwordApi.analyze({ password })
      setResult(response.data)
      addAlert({ type: 'info', message: 'Credentials audit complete.' })
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  const getStrengthProgressWidth = (score) => {
    const widths = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full']
    return widths[score] || 'w-0'
  }

  const getStrengthBgColor = (score) => {
    const colors = ['bg-cyber-danger', 'bg-orange-500', 'bg-cyber-warning', 'bg-lime-500', 'bg-cyber-success']
    return colors[score] || 'bg-cyber-muted'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Password Strength Analyzer</h1>
        <p className="text-cyber-muted mt-1">
          Perform a local-first security check using Gemini LLM to check vulnerabilities, entropy, and crack difficulty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Card */}
        <GlassCard className="p-6 border border-cyber-border/40 lg:col-span-2 flex flex-col h-fit">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
                Enter Password
              </label>
              <div className="relative">
                <input
                  type="text" // Plain text input so users can see what they're evaluating
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. P@ssw0rd123!"
                  className="input-field font-mono"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                'Audit Credentials'
              )}
            </button>
          </form>
        </GlassCard>

        {/* Results Card */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyber-accent mb-4" />
              <p className="text-sm text-cyber-muted animate-pulse">Running cryptographic simulations...</p>
            </GlassCard>
          )}

          {!loading && !result && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center text-center h-full min-h-[300px] text-cyber-muted">
              <FiLock className="text-5xl mb-4 text-cyber-border" />
              <h3 className="font-bold text-white mb-2">Awaiting Credentials</h3>
              <p className="text-xs leading-relaxed max-w-xs">
                Provide a key string to evaluate character distribution, entropy ratings, and brute-force complexity.
              </p>
            </GlassCard>
          )}

          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Score meter & Strength details */}
              <GlassCard className="p-6 border border-cyber-border/40 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-cyber-glow">
                    Strength Verdict
                  </h3>
                  <span className={`text-base font-extrabold ${getPasswordStrengthColor(result.score)}`}>
                    {result.strength_label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-cyber-navy/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthProgressWidth(result.score)} ${getStrengthBgColor(result.score)} transition-all duration-500`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/30 text-center">
                    <span className="text-[10px] uppercase text-cyber-muted block">Crack Time</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {result.estimated_crack_time}
                    </span>
                  </div>
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/30 text-center">
                    <span className="text-[10px] uppercase text-cyber-muted block">Password Length</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {result.length} characters
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Character Checklist */}
              <GlassCard className="p-6 border border-cyber-border/40 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
                  Entropy Composition
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {result.has_uppercase ? <FiCheck className="text-cyber-success" /> : <FiAlertCircle className="text-cyber-danger" />}
                    <span>Uppercase Letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.has_lowercase ? <FiCheck className="text-cyber-success" /> : <FiAlertCircle className="text-cyber-danger" />}
                    <span>Lowercase Letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.has_numbers ? <FiCheck className="text-cyber-success" /> : <FiAlertCircle className="text-cyber-danger" />}
                    <span>Numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.has_symbols ? <FiCheck className="text-cyber-success" /> : <FiAlertCircle className="text-cyber-danger" />}
                    <span>Symbols</span>
                  </div>
                </div>
              </GlassCard>

              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <GlassCard className="p-6 border border-cyber-border/40 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow flex items-center gap-1.5">
                    <FiInfo className="text-cyber-sky" /> Security Adjustments
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.suggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyber-warning mt-0.5">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
