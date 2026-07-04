import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import {
  MdOutlineShield,
  MdDashboard,
  MdOutlineEmail,
  MdOutlineLock,
  MdOutlineLink,
  MdOutlineSmartToy,
  MdOutlineLightbulb,
  MdOutlineAssessment,
  MdOutlineChecklist,
  MdOutlineNotifications,
  MdOutlineHistory,
  MdOutlineLogout,
} from 'react-icons/md'

const navItems = [
  { to: '/dashboard',       icon: MdDashboard,             label: 'Dashboard'       },
  { to: '/phishing',        icon: MdOutlineEmail,          label: 'Phishing Detection' },
  { to: '/password',        icon: MdOutlineLock,           label: 'Password Analyzer'  },
  { to: '/url-scanner',     icon: MdOutlineLink,           label: 'URL Scanner'        },
  { to: '/chatbot',         icon: MdOutlineSmartToy,       label: 'AI Chatbot'         },
  { to: '/recommendations', icon: MdOutlineLightbulb,      label: 'Recommendations'    },
  { to: '/threat-score',    icon: MdOutlineAssessment,     label: 'Threat Scoring'     },
  { to: '/checklist',       icon: MdOutlineChecklist,      label: 'Security Checklist' },
  { to: '/alerts',          icon: MdOutlineNotifications,  label: 'Alerts'             },
  { to: '/history',         icon: MdOutlineHistory,        label: 'History'            },
]

/**
 * Main sidebar navigation.
 * @param {boolean} isOpen   - Mobile sidebar open state
 * @param {function} onClose - Close handler for mobile
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-cyber-border/50">
        <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center shadow-glow-blue shrink-0">
          <MdOutlineShield className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">AI CyberShield</h1>
          <p className="text-xs text-cyber-muted">Security Assistant</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
               ${isActive
                ? 'bg-cyber-accent/20 text-white border border-cyber-accent/40 shadow-glow-sm'
                : 'text-cyber-muted hover:text-white hover:bg-cyber-navy/60'}`
            }
          >
            <Icon className="text-lg shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-cyber-border/50">
        <div className="glass-card p-3 mb-3">
          <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'User'}</p>
          <p className="text-xs text-cyber-muted truncate">{user?.email || ''}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                     text-cyber-muted hover:text-cyber-danger hover:bg-cyber-danger/10 transition-all duration-200"
        >
          <MdOutlineLogout className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-cyber-dark/80 border-r border-cyber-border/50 backdrop-blur-md h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              key="sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-cyber-dark border-r border-cyber-border/50 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
