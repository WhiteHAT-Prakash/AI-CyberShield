import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { dashboardApi, alertsApi } from '../../api'
import { getErrorMessage, getThreatLevel, formatDate } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import {
  FiShield,
  FiMail,
  FiLink,
  FiLock,
  FiAlertTriangle,
  FiActivity,
  FiArrowRight,
  FiMessageSquare,
} from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addAlert } = useAlerts()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [summaryRes, alertsRes] = await Promise.all([
          dashboardApi.getSummary(),
          alertsApi.getAll(),
        ])
        setData(summaryRes.data)
        setAlerts(alertsRes.data.slice(0, 3)) // Show top 3 recent alerts
      } catch (err) {
        addAlert({ type: 'danger', message: getErrorMessage(err) })
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [addAlert])

  if (loading) {
    return <LoadingSpinner size="lg" label="Decrypting security records..." />
  }

  const threat = getThreatLevel(data?.threat_score || 0)

  const quickActions = [
    {
      title: 'Phishing Detector',
      desc: 'Verify suspicious emails or messages using Gemini AI.',
      icon: FiMail,
      path: '/phishing',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Suspicious URL Scanner',
      desc: 'Analyze domains and links for cyber threats.',
      icon: FiLink,
      path: '/url-scanner',
      color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400',
    },
    {
      title: 'Password Strength Analyzer',
      desc: 'Audit credentials using security metrics.',
      icon: FiLock,
      path: '/password',
      color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400',
    },
    {
      title: 'AI Cyber Copilot',
      desc: 'Get immediate answers to cybersecurity queries.',
      icon: FiMessageSquare,
      path: '/chatbot',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header welcome message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Security Control Panel
          </h1>
          <p className="text-cyber-muted mt-1">
            Welcome back, <span className="text-cyber-sky font-semibold">{data?.user?.full_name}</span>. Your automated defense systems are online.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-cyber-navy/40 border border-cyber-border/40 px-4 py-2 rounded-xl text-xs text-cyber-glow">
          <FiActivity className="animate-pulse text-cyber-success" /> System Integrity: Optimal
        </div>
      </div>

      {/* Grid of Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Threat Scoring Ring Gauge */}
        <GlassCard className="p-6 border border-cyber-border/40 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gradient opacity-10 rounded-full filter blur-xl group-hover:opacity-25 transition-all duration-300" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-6 self-start">
            Threat Risk Score
          </h3>
          
          <div className="relative w-44 h-44 flex items-center justify-center mb-4">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-cyber-navy"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-cyber-accent transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="465"
                strokeDashoffset={465 - (465 * (data?.threat_score || 0)) / 100}
                strokeLinecap="round"
                style={{ stroke: 'url(#accent-grad)' }}
              />
              <defs>
                <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {data?.threat_score || 0}%
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${threat.color}`}>
                {threat.label} Risk
              </span>
            </div>
          </div>

          <div className="w-full mt-2 text-center text-xs text-cyber-muted">
            Score evaluated from scan counts and security indicators.
          </div>
          <button 
            onClick={() => navigate('/threat-score')}
            className="mt-4 text-xs font-semibold text-cyber-sky hover:text-white flex items-center gap-1 transition-all"
          >
            Detailed Scoring Analysis <FiArrowRight />
          </button>
        </GlassCard>

        {/* Stats Grid Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <GlassCard className="p-6 flex flex-col justify-between hover:border-cyber-accent/40 transition-all duration-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyber-glow">Total Scans Run</span>
              <span className="text-4xl font-extrabold text-white mt-4">{data?.total_scans || 0}</span>
              <span className="text-xs text-cyber-muted mt-2">All security modules</span>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-between hover:border-cyber-danger/40 transition-all duration-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyber-glow">Phishing Detections</span>
              <span className="text-4xl font-extrabold text-cyber-danger mt-4">{data?.phishing_found || 0}</span>
              <span className="text-xs text-cyber-muted mt-2">High risk threats flagged</span>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-between hover:border-cyber-warning/40 transition-all duration-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyber-glow">Active Security Alerts</span>
              <span className="text-4xl font-extrabold text-cyber-warning mt-4">{data?.unread_alerts || 0}</span>
              <span className="text-xs text-cyber-muted mt-2">Unread system notifications</span>
            </GlassCard>
          </div>

          {/* Alerts Feed Widget */}
          <GlassCard className="p-6 border border-cyber-border/40 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow">
                  Recent Threat Alerts
                </h3>
                <Link to="/alerts" className="text-xs font-semibold text-cyber-sky hover:underline flex items-center gap-1">
                  View All Alerts <FiArrowRight />
                </Link>
              </div>
              
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-6 text-sm text-cyber-muted">
                    No active threat logs detected. Your system is safe.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`flex gap-3 p-3 rounded-lg border bg-cyber-navy/40 transition-all duration-200
                        ${alert.type === 'danger' ? 'border-cyber-danger/25 text-red-100 hover:bg-cyber-danger/5' : 
                          alert.type === 'warning' ? 'border-cyber-warning/25 text-amber-100 hover:bg-cyber-warning/5' : 
                          'border-cyber-border/30 text-slate-100 hover:bg-cyber-blue/10'}`}
                    >
                      <FiAlertTriangle className={`shrink-0 mt-0.5 ${
                        alert.type === 'danger' ? 'text-cyber-danger' : 
                        alert.type === 'warning' ? 'text-cyber-warning' : 
                        'text-cyber-sky'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{alert.title}</p>
                        <p className="text-[11px] text-cyber-muted truncate mt-0.5">{alert.message}</p>
                      </div>
                      <span className="text-[10px] text-cyber-muted self-center shrink-0">
                        {formatDate(alert.created_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Launchpad Actions */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-cyber-glow">
          Launch Security Operations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, idx) => (
            <motion.div
              key={action.title}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => navigate(action.path)}
              className={`p-6 border rounded-2xl bg-gradient-to-br ${action.color} backdrop-blur-md shadow-card hover:shadow-glow-blue cursor-pointer flex flex-col justify-between transition-all duration-300`}
            >
              <div>
                <action.icon className="text-3xl mb-4" />
                <h3 className="text-base font-bold text-white mb-2">{action.title}</h3>
                <p className="text-xs text-cyber-muted leading-relaxed">{action.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mt-6 self-end hover:gap-2 transition-all">
                Launch <FiArrowRight />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
