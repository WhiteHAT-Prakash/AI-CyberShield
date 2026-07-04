import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAlerts } from '../../contexts/AlertContext'
import { authApi } from '../../api'
import { getErrorMessage } from '../../utils/helpers'
import { FiUser, FiMail, FiLock, FiShield, FiArrowRight } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'None' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addAlert } = useAlerts()
  const navigate = useNavigate()

  // Simple local password strength estimator (for instant UX feedback before registration)
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: 'None' })
      return
    }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Excellent']
    setPasswordStrength({
      score: Math.min(score - 1, 4),
      label: labels[Math.min(score - 1, 4)] || 'Very Weak'
    })
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      addAlert({ type: 'warning', message: 'Passwords do not match.' })
      return
    }

    if (password.length < 8) {
      addAlert({ type: 'warning', message: 'Password must be at least 8 characters long.' })
      return
    }

    setLoading(true)
    try {
      // 1. Register User
      await authApi.register({
        full_name: fullName,
        email,
        password,
      })

      addAlert({ type: 'success', message: 'Registration successful! Signing you in...' })

      // 2. Automatically Login after registration
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await authApi.login(formData)
      const { access_token, user } = response.data

      login(access_token, user)
      navigate('/dashboard')
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  const getStrengthBarColor = (score) => {
    const colors = ['bg-cyber-danger', 'bg-orange-500', 'bg-cyber-warning', 'bg-lime-500', 'bg-cyber-success']
    return colors[score] || 'bg-cyber-muted'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cyber-black">
      {/* Background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-accent/10 rounded-full filter blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full filter blur-3xl animate-pulse-slow" />

      <GlassCard className="max-w-md w-full p-8 border border-cyber-border/40 relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-accent-gradient flex items-center justify-center shadow-glow-blue mb-4">
            <FiShield className="text-white text-3xl animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-accent-gradient text-center">
            Create Account
          </h2>
          <p className="text-sm text-cyber-muted mt-2">
            Secure your digital defense systems
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-muted">
                <FiUser />
              </span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field pl-10"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-1">
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
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-1">
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
                placeholder="Minimum 8 characters"
              />
            </div>
            {/* Password strength UI */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-cyber-muted">Strength:</span>
                  <span className="font-semibold" style={{ color: `var(--color-${passwordStrength.label.toLowerCase()})` }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-cyber-navy/80 rounded-full overflow-hidden flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 transition-colors duration-300 ${
                        i <= passwordStrength.score ? getStrengthBarColor(passwordStrength.score) : 'bg-cyber-border/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-muted">
                <FiLock />
              </span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <>
                Register & Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-cyber-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-cyber-sky hover:underline font-semibold transition-all">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
