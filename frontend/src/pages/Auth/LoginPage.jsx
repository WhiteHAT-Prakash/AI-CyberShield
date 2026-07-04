import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useAlerts } from '../../contexts/AlertContext'
import { authApi } from '../../api'
import { getErrorMessage } from '../../utils/helpers'
import { FiMail, FiLock, FiShield, FiArrowRight } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addAlert } = useAlerts()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      addAlert({ type: 'warning', message: 'Please enter both email and password.' })
      return
    }

    setLoading(true)
    try {
      // API expects OAuth2 Form data (username/password)
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await authApi.login(formData)
      const { access_token, user } = response.data

      login(access_token, user)
      addAlert({ type: 'success', message: `Welcome back, ${user.full_name}!` })
      navigate('/dashboard')
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cyber-black">
      {/* Background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-accent/10 rounded-full filter blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full filter blur-3xl animate-pulse-slow" />

      <GlassCard className="max-w-md w-full p-8 border border-cyber-border/40 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-gradient flex items-center justify-center shadow-glow-blue mb-4">
            <FiShield className="text-white text-3xl animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-accent-gradient">
            AI CyberShield
          </h2>
          <p className="text-sm text-cyber-muted mt-2">
            Intelligent Cybersecurity Assistant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-muted">
                <FiMail />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-muted">
                <FiLock />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
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
              <>
                Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-cyber-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyber-sky hover:underline font-semibold transition-all">
            Create account
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
