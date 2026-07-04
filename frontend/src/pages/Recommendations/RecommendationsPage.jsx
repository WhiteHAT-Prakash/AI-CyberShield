import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { recommendationsApi } from '../../api'
import { getErrorMessage } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiCheckSquare, FiAward, FiAlertTriangle, FiTarget, FiInfo } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function RecommendationsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addAlert } = useAlerts()

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await recommendationsApi.get()
        setData(response.data)
      } catch (err) {
        addAlert({ type: 'danger', message: getErrorMessage(err) })
      } finally {
        setLoading(false)
      }
    }
    loadRecommendations()
  }, [addAlert])

  if (loading) {
    return <LoadingSpinner size="lg" label="Generating safety adjustments recommendations..." />
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'badge-danger'
      case 'medium':
        return 'badge-warning'
      default:
        return 'badge-success'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'password':
        return '🔑'
      case 'phishing':
        return '📧'
      case 'network':
        return '🌐'
      case 'data':
        return '💾'
      default:
        return '🛡️'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Security Recommendations</h1>
          <p className="text-cyber-muted mt-1">
            Personalized safety recommendations generated based on your past operations and system activities.
          </p>
        </div>
        
        {data?.overall_security_grade && (
          <div className="flex items-center gap-3 bg-cyber-navy/40 border border-cyber-border/40 p-4 rounded-xl">
            <FiAward className="text-2xl text-cyber-sky" />
            <div>
              <span className="text-[10px] text-cyber-muted uppercase block">Security Grade</span>
              <span className="text-2xl font-black text-white">{data.overall_security_grade}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6">
        {(!data?.recommendations || data.recommendations.length === 0) ? (
          <GlassCard className="p-8 text-center text-cyber-muted">
            <FiCheckSquare className="text-5xl mx-auto mb-4 text-cyber-border" />
            <h3 className="text-lg font-bold text-white mb-2">No Recommendations Found</h3>
            <p className="text-sm">You have clean logs. Continue running scans to populate advisory assessments.</p>
          </GlassCard>
        ) : (
          data.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <GlassCard className="p-6 border border-cyber-border/40 hover:border-cyber-accent/40 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border/30 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0" role="img" aria-label="category">
                      {getCategoryIcon(rec.category)}
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">{rec.title}</h3>
                      <span className="text-[10px] uppercase text-cyber-muted tracking-wider">
                        Category: {rec.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`capitalize ${getPriorityBadgeClass(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-200 leading-relaxed">{rec.description}</p>

                  {rec.action_steps && rec.action_steps.length > 0 && (
                    <div className="bg-cyber-navy/40 p-4 rounded-xl border border-cyber-border/30 space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow flex items-center gap-1.5">
                        <FiTarget className="text-cyber-sky" /> Action Checklist
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {rec.action_steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-cyber-success mt-0.5">✓</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
