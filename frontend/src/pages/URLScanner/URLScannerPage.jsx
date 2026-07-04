import { useState } from 'react'
import { motion } from 'framer-motion'
import { urlScannerApi } from '../../api'
import { getErrorMessage } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiLink, FiAlertTriangle, FiCheckCircle, FiShield, FiAlertOctagon } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'

export default function URLScannerPage() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { addAlert } = useAlerts()

  const handleScan = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      addAlert({ type: 'warning', message: 'Please enter a URL to scan.' })
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const response = await urlScannerApi.scan({ url })
      setResult(response.data)
      if (response.data.is_malicious || response.data.is_suspicious) {
        addAlert({ type: 'danger', message: '⚠️ WARNING: Suspicious indicators detected on this domain!' })
      } else {
        addAlert({ type: 'success', message: 'Domain scan complete: Target is safe.' })
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
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Suspicious URL Scanner</h1>
        <p className="text-cyber-muted mt-1">
          Perform immediate reputation scan, domain configuration diagnostics, and safety audits using Gemini AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Card */}
        <GlassCard className="p-6 border border-cyber-border/40 lg:col-span-2 flex flex-col h-fit">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
                Target URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example-phish-domain.com"
                className="input-field"
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
                'Initiate URL Scan'
              )}
            </button>
          </form>
        </GlassCard>

        {/* Results Card */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyber-accent mb-4" />
              <p className="text-sm text-cyber-muted animate-pulse">Analyzing registrar databases & certificates...</p>
            </GlassCard>
          )}

          {!loading && !result && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center text-center h-full min-h-[300px] text-cyber-muted">
              <FiLink className="text-5xl mb-4 text-cyber-border" />
              <h3 className="font-bold text-white mb-2">Scan Awaiting Input</h3>
              <p className="text-xs leading-relaxed max-w-xs">
                Provide a target link address on the left to verify registry status, SSL protocols, and threat profiles.
              </p>
            </GlassCard>
          )}

          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Risk Level Verdict */}
              <GlassCard className={`p-6 border ${
                result.is_malicious || result.is_suspicious ? 'border-cyber-danger/45 bg-cyber-danger/5' : 'border-cyber-success/45 bg-cyber-success/5'
              }`}>
                <div className="flex items-center gap-3">
                  {result.is_malicious || result.is_suspicious ? (
                    <FiAlertOctagon className="text-3xl text-cyber-danger shrink-0" />
                  ) : (
                    <FiCheckCircle className="text-3xl text-cyber-success shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {result.is_malicious ? 'Malicious URL Flagged' : result.is_suspicious ? 'Suspicious URL Flagged' : 'URL Appears Secure'}
                    </h3>
                    <p className="text-xs text-cyber-muted">
                      Targeted Domain: <span className="text-white font-mono">{url}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/30">
                    <span className="text-[10px] uppercase text-cyber-muted block">Risk Rating</span>
                    <span className={`text-base font-extrabold capitalize ${
                      result.risk_level === 'high' || result.risk_level === 'critical' ? 'text-cyber-danger' : 
                      result.risk_level === 'medium' ? 'text-cyber-warning' : 'text-cyber-success'
                    }`}>{result.risk_level}</span>
                  </div>
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/30">
                    <span className="text-[10px] uppercase text-cyber-muted block">Diagnostic Status</span>
                    <span className={`text-base font-extrabold ${result.is_malicious ? 'text-cyber-danger' : 'text-white'}`}>
                      {result.is_malicious ? 'BLOCKED' : result.is_suspicious ? 'CAUTION' : 'CLEAR'}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Domain & Certificate Breakdown */}
              <GlassCard className="p-6 border border-cyber-border/40 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-1">Threat Assessment</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{result.explanation}</p>
                </div>

                {result.domain_analysis && (
                  <div className="border-t border-cyber-border/30 pt-4 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow">Domain Diagnostics</h4>
                    <div className="grid grid-cols-3 gap-4 text-[11px]">
                      <div>
                        <span className="text-cyber-muted block">HTTPS Enabled</span>
                        <span className={`font-bold ${result.domain_analysis.uses_https ? 'text-cyber-success' : 'text-cyber-danger'}`}>
                          {result.domain_analysis.uses_https ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-muted block">Suspicious TLD</span>
                        <span className={`font-bold ${result.domain_analysis.suspicious_tld ? 'text-cyber-danger' : 'text-cyber-success'}`}>
                          {result.domain_analysis.suspicious_tld ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-muted block">Domain Age Risk</span>
                        <span className={`font-bold ${result.domain_analysis.age_suspicious ? 'text-cyber-danger' : 'text-cyber-success'}`}>
                          {result.domain_analysis.age_suspicious ? 'High' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {result.indicators && result.indicators.length > 0 && (
                  <div className="border-t border-cyber-border/30 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">Detected Threat Factors</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.indicators.map((ind, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyber-danger mt-0.5">•</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendation && (
                  <div className="border-t border-cyber-border/30 pt-4 bg-cyber-blue/10 p-4 rounded-lg">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-1 flex items-center gap-1">
                      <FiShield className="text-cyber-sky" /> Actionable Advice
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
