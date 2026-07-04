import { useLocation } from 'react-router-dom'
import { MdOutlineMenu, MdOutlineNotifications, MdOutlineShield } from 'react-icons/md'
import { useAlerts } from '../../contexts/AlertContext'
import { useAuth } from '../../contexts/AuthContext'

// Maps route paths to human-readable page titles
const pageTitles = {
  '/dashboard':       'Dashboard',
  '/phishing':        'Phishing Detection',
  '/password':        'Password Analyzer',
  '/url-scanner':     'URL Scanner',
  '/chatbot':         'AI Chatbot',
  '/recommendations': 'Recommendations',
  '/threat-score':    'Threat Risk Scoring',
  '/checklist':       'Security Checklist',
  '/alerts':          'Real-Time Alerts',
  '/history':         'User History',
}

/**
 * Top navigation bar.
 * @param {function} onMenuClick - Opens the mobile sidebar
 */
export default function Navbar({ onMenuClick }) {
  const location = useLocation()
  const { alerts } = useAlerts()
  const { user } = useAuth()

  const pageTitle = pageTitles[location.pathname] || 'AI CyberShield'
  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <header className="h-16 bg-cyber-dark/70 border-b border-cyber-border/50 backdrop-blur-md 
                       flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-cyber-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-cyber-navy/60"
          aria-label="Open navigation"
          id="nav-menu-btn"
        >
          <MdOutlineMenu className="text-2xl" />
        </button>
        <div className="flex items-center gap-2">
          <MdOutlineShield className="text-cyber-accent text-lg hidden sm:block" />
          <h2 className="text-base font-semibold text-white">{pageTitle}</h2>
        </div>
      </div>

      {/* Right: status badge + user avatar */}
      <div className="flex items-center gap-3">
        {/* AI online indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-cyber-success bg-cyber-success/10 border border-cyber-success/30 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-success animate-pulse-slow" />
          AI Online
        </div>

        {/* Notification bell */}
        <a href="/alerts" className="relative p-1.5 rounded-lg hover:bg-cyber-navy/60 transition-colors" id="alerts-bell-btn">
          <MdOutlineNotifications className="text-xl text-cyber-muted hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyber-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </a>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-white text-xs font-bold shadow-glow-sm">
          {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
