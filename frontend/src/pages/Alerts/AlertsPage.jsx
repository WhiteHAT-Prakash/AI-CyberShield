import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { alertsApi } from '../../api'
import { getErrorMessage, formatDate } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiAlertTriangle, FiCheckCircle, FiTrash2, FiMail, FiMessageSquare } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addAlert } = useAlerts()

  async function loadAlerts() {
    try {
      const response = await alertsApi.getAll()
      setAlerts(response.data)
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [])

  const handleMarkRead = async (alertId) => {
    try {
      await alertsApi.markRead(alertId)
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, is_read: true } : a))
      )
      addAlert({ type: 'success', message: 'Alert marked as read.', duration: 1500 })
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await alertsApi.markAllRead()
      setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })))
      addAlert({ type: 'success', message: 'All alerts marked as read.' })
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" label="Decrypting security alarm log..." />
  }

  const unreadCount = alerts.filter((a) => !a.is_read).length

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Alarm Center</h1>
          <p className="text-cyber-muted mt-1">
            Review and clear system alerts relating to malicious URL clicks, phishing logs, or suspicious actions.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn-ghost text-xs font-semibold px-4 py-2 flex items-center gap-1.5 self-start sm:self-center"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <GlassCard className="p-8 text-center text-cyber-muted">
            <FiCheckCircle className="text-5xl mx-auto mb-4 text-cyber-success" />
            <h3 className="text-lg font-bold text-white mb-2">No Alarms Traced</h3>
            <p className="text-sm">Your security perimeter is secure. No threat flags have been raised.</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`relative overflow-hidden`}
                >
                  <GlassCard className={`p-4 border transition-all duration-300 flex items-start gap-4
                    ${alert.is_read ? 'border-cyber-border/20 opacity-60' : 'border-cyber-accent/40 shadow-glow-sm'}`}
                  >
                    {/* Alert Type Icon indicator */}
                    <span className="mt-0.5 shrink-0">
                      {alert.type === 'danger' ? (
                        <FiAlertTriangle className="text-cyber-danger text-lg" />
                      ) : alert.type === 'warning' ? (
                        <FiAlertTriangle className="text-cyber-warning text-lg" />
                      ) : (
                        <FiCheckCircle className="text-cyber-success text-lg" />
                      )}
                    </span>

                    {/* Alert details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          {alert.title}
                          {!alert.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse" />
                          )}
                        </h4>
                        <span className="text-[10px] text-cyber-muted font-mono">
                          {formatDate(alert.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">{alert.message}</p>
                    </div>

                    {/* Actions button */}
                    {!alert.is_read && (
                      <button
                        onClick={() => handleMarkRead(alert.id)}
                        className="text-[10px] uppercase font-bold tracking-wider text-cyber-sky hover:text-white px-2.5 py-1 rounded bg-cyber-navy/40 border border-cyber-border/40 hover:border-cyber-accent/40 shrink-0 self-center transition-all"
                      >
                        Clear
                      </button>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
