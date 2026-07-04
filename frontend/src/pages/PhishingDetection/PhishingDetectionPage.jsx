import { useState } from 'react'
import { motion } from 'framer-motion'
import { phishingApi } from '../../api'
import { getErrorMessage } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiMail, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'

export default function PhishingDetectionPage() {
  const [content, setContent] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { addAlert } = useAlerts()

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      addAlert({ type: 'warning', message: 'Please paste email or message content first.' })
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const response = await phishingApi.analyze({ content })
      setResult(response.data)
      if (response.data.is_phishing) {
        addAlert({ type: 'danger', message: '⚠️ WARNING: Phishing indicators detected in this content!' })
      } else {
        addAlert({ type: 'success', message: 'Analysis complete: Content appears safe.' })
      }
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Phishing Detector</h1>
        <p className="text-cyber-muted mt-1">
          Paste the raw content of any suspicious email, text message, or communication to check for malicious indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Card */}
        <GlassCard className="p-6 border border-cyber-border/40 lg:col-span-3 flex flex-col h-fit">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
                Paste Content Here
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the email headers, body, or suspicious text message here..."
                rows="10"
                className="input-field resize-none h-64"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                'Run Phishing Analysis'
              )}
            </button>
          </form>
        </GlassCard>

        {/* Results Card */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyber-accent mb-4" />
              <p className="text-sm text-cyber-muted animate-pulse">Running semantic scan...</p>
            </GlassCard>
          )}

          {!loading && !result && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center text-center h-full min-h-[300px] text-cyber-muted">
              <FiMail className="text-5xl mb-4 text-cyber-border" />
              <h3 className="font-bold text-white mb-2">No Analysis Run</h3>
              <p className="text-xs leading-relaxed max-w-xs">
                Provide suspicious communications on the left to initiate the AI scanner.
              </p>
            </GlassCard>
          )}

          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Risk Summary Card */}
              <GlassCard className={`p-6 border ${
                result.is_phishing ? 'border-cyber-danger/45 bg-cyber-danger/5' : 'border-cyber-success/45 bg-cyber-success/5'
              }`}>
                <div className="flex items-center gap-3">
                  {result.is_phishing ? (
                    <FiAlertTriangle className="text-3xl text-cyber-danger shrink-0" />
                  ) : (
                    <FiCheckCircle className="text-3xl text-cyber-success shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {result.is_phishing ? 'Phishing Detected' : 'Content Safe'}
                    </h3>
                    <p className="text-xs text-cyber-muted">
                      Confidence Level: <span className="text-white font-semibold">{result.confidence}%</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/40">
                    <span className="text-[10px] uppercase text-cyber-muted block">Risk Level</span>
                    <span className={`text-base font-extrabold capitalize ${
                      result.risk_level === 'high' || result.risk_level === 'critical' ? 'text-cyber-danger' : 
                      result.risk_level === 'medium' ? 'text-cyber-warning' : 'text-cyber-success'
                    }`}>{result.risk_level}</span>
                  </div>
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/40">
                    <span className="text-[10px] uppercase text-cyber-muted block">Verdict</span>
                    <span className="text-base font-extrabold text-white">
                      {result.is_phishing ? 'DO NOT TRUST' : 'Low Threat'}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Indicators & Explanations */}
              <GlassCard className="p-6 border border-cyber-border/40 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">Explanation</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{result.explanation}</p>
                </div>

                {result.indicators && result.indicators.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
                      Suspicious Signals Found
                    </h4>
                    <ul className="space-y-1.5">
                      {result.indicators.map((ind, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-cyber-danger mt-0.5">•</span> {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendation && (
                  <div className="border-t border-cyber-border/30 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-1.5 flex items-center gap-1">
                      <FiInfo className="text-cyber-sky" /> Suggested Actions
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.recommendation}</p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
