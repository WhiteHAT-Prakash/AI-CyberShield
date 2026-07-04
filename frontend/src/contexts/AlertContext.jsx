import { createContext, useContext, useState, useCallback } from 'react'

const AlertContext = createContext(null)

/**
 * Provides a global notification/toast system.
 * Components call addAlert({ type, message }) to show a toast.
 */
export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  const addAlert = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = Date.now()
    setAlerts((prev) => [...prev, { id, type, message }])
    setTimeout(() => removeAlert(id), duration)
  }, [])

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlerts() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlerts must be used within <AlertProvider>')
  return ctx
}
