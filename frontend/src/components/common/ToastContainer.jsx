import { AnimatePresence, motion } from 'framer-motion'
import { useAlerts } from '../../contexts/AlertContext'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi'

const iconMap = {
  success: <FiCheckCircle className="text-cyber-success text-lg" />,
  danger:  <FiAlertCircle className="text-cyber-danger text-lg" />,
  warning: <FiAlertTriangle className="text-cyber-warning text-lg" />,
  info:    <FiInfo className="text-cyber-sky text-lg" />,
}

const borderMap = {
  success: 'border-cyber-success/40',
  danger:  'border-cyber-danger/40',
  warning: 'border-cyber-warning/40',
  info:    'border-cyber-accent/40',
}

/** Global toast notification container – renders in top-right corner */
export default function ToastContainer() {
  const { alerts, removeAlert } = useAlerts()

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0,  scale: 1    }}
            exit={{    opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`glass-card border ${borderMap[alert.type] || borderMap.info} 
                        flex items-start gap-3 p-4 pointer-events-auto`}
          >
            <span className="mt-0.5 shrink-0">{iconMap[alert.type] || iconMap.info}</span>
            <p className="text-sm text-white flex-1 leading-relaxed">{alert.message}</p>
            <button
              onClick={() => removeAlert(alert.id)}
              className="text-cyber-muted hover:text-white transition-colors mt-0.5 shrink-0"
            >
              <FiX />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
