import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { threatScoreApi } from '../../api'
import { getErrorMessage, getThreatLevel, formatDate } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiTrendingUp, FiActivity, FiRefreshCw, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function ThreatScoringPage() {
  const [data, setData] = useState(null)
  const [scoreDetails, setScoreDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const { addAlert } = useAlerts()

  async function loadScore() {
    try {
      const response = await threatScoreApi.getScore()
      setData(response.data)
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScore()
  }, [])

  const handleRecalculate = async () => {
    setCalculating(true)
    try {
      const response = await threatScoreApi.calculate()
      setScoreDetails(response.data)
      // Refresh local user score database cache
      await loadScore()
      addAlert({ type: 'success', message: 'Threat score successfully recalculated.' })
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setCalculating(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" label="Accessing cryptographic score log..." />
  }

  const threat = getThreatLevel(data?.score || 0)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Threat Risk Scoring</h1>
          <p className="text-cyber-muted mt-1">
            Reassess overall exposure risk calculated dynamically by AI from scans and events history.
          </p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="btn-primary flex items-center gap-2 self-start sm:self-center"
        >
          <FiRefreshCw className={calculating ? 'animate-spin' : ''} />
          {calculating ? 'Recalculating...' : 'Trigger Recalculation'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Risk Score Widget */}
        <GlassCard className="p-6 border border-cyber-border/40 md:col-span-2 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-6 self-start">
            Threat Evaluation
          </h3>

          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                className="stroke-cyber-navy"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                className="stroke-cyber-accent transition-all duration-1000 ease-out"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="502"
                strokeDashoffset={502 - (502 * (data?.score || 0)) / 100}
                strokeLinecap="round"
                style={{ stroke: 'url(#score-grad)' }}
              />
              <defs>
                <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-black tracking-tight text-white">{data?.score || 0}%</span>
              <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${threat.color}`}>
                Grade {data?.grade || 'N/A'}
              </span>
            </div>
          </div>

          <div className="w-full space-y-3 border-t border-cyber-border/30 pt-4 text-xs">
            <div className="flex justify-between">
              <span className="text-cyber-muted">Exposure Status:</span>
              <span className={`font-bold ${threat.color}`}>{threat.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-muted">Last Updated:</span>
              <span className="text-white font-mono">{formatDate(data?.last_updated)}</span>
            </div>
          </div>
        </GlassCard>

        {/* Detailed Breakdown */}
        <div className="md:col-span-3 space-y-6">
          
          {calculating && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyber-accent mb-4" />
              <p className="text-sm text-cyber-muted animate-pulse">Running exposure model risk assessment...</p>
            </GlassCard>
          )}

          {!calculating && !scoreDetails && (
            <GlassCard className="p-8 border border-cyber-border/40 h-full flex flex-col justify-center text-cyber-muted">
              <FiActivity className="text-5xl mb-4 text-cyber-accent" />
              <h3 className="font-bold text-white mb-2">Exposure Assessment Logs</h3>
              <p className="text-xs leading-relaxed">
                Click "Trigger Recalculation" to re-calculate risk metrics using past scanning patterns.
              </p>
            </GlassCard>
          )}

          {!calculating && scoreDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Detailed Verdict Card */}
              <GlassCard className="p-6 border border-cyber-border/40 space-y-4">
                <div className="flex items-center gap-2 border-b border-cyber-border/30 pb-3 mb-2">
                  <FiTrendingUp className="text-cyber-sky text-lg" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-cyber-glow">
                    Diagnostic Analysis
                  </h3>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-cyber-muted mb-1">Exposure Verdict</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{scoreDetails.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/30">
                    <span className="text-[10px] uppercase text-cyber-muted block">Risk Trend</span>
                    <span className={`text-xs font-bold capitalize block mt-0.5 ${
                      scoreDetails.trend === 'improving' ? 'text-cyber-success' : 
                      scoreDetails.trend === 'worsening' ? 'text-cyber-danger' : 'text-cyber-warning'
                    }`}>{scoreDetails.trend}</span>
                  </div>
                  <div className="bg-cyber-navy/45 p-3 rounded-lg border border-cyber-border/30">
                    <span className="text-[10px] uppercase text-cyber-muted block">Security Grade</span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      Grade {scoreDetails.grade}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Risk Factors List */}
              {scoreDetails.risk_factors && scoreDetails.risk_factors.length > 0 && (
                <GlassCard className="p-6 border border-cyber-border/40 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2 flex items-center gap-1">
                    <FiAlertTriangle className="text-cyber-danger" /> Primary Risk Vulnerabilities
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {scoreDetails.risk_factors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FiAlertCircle className="text-cyber-danger mt-0.5 shrink-0" />
                        <span>{factor}</span>
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
