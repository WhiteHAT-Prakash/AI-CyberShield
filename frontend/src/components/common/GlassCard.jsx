import { motion } from 'framer-motion'

/**
 * Reusable glass-style card with optional hover animation.
 *
 * @param {boolean} hover     - Enable hover glow effect
 * @param {string}  className - Additional Tailwind classes
 */
export default function GlassCard({ children, hover = false, className = '', onClick, ...props }) {
  const base = hover ? 'glass-card-hover' : 'glass-card'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`${base} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  )
}
