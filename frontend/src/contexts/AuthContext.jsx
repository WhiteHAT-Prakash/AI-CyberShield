import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

/**
 * AuthProvider wraps the app and exposes auth state + actions.
 * Reads from localStorage on mount to restore session.
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true) // true while restoring session

  // Restore session from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    const storedUser  = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  /** Persist login data to state and localStorage */
  const login = useCallback((tokenValue, userData) => {
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem('access_token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  /** Clear all auth state */
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }, [])

  /** Refresh user profile from backend */
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.getMe()
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
    } catch {
      logout()
    }
  }, [logout])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook to consume auth context */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
