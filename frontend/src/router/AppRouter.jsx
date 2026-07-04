import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Layouts
import AppLayout from '../components/layout/AppLayout'

// Auth pages
import LoginPage    from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'

// Feature pages
import DashboardPage          from '../pages/Dashboard/DashboardPage'
import PhishingDetectionPage  from '../pages/PhishingDetection/PhishingDetectionPage'
import PasswordAnalyzerPage   from '../pages/PasswordAnalyzer/PasswordAnalyzerPage'
import URLScannerPage         from '../pages/URLScanner/URLScannerPage'
import ChatbotPage            from '../pages/Chatbot/ChatbotPage'
import RecommendationsPage    from '../pages/Recommendations/RecommendationsPage'
import ThreatScoringPage      from '../pages/ThreatScoring/ThreatScoringPage'
import SecurityChecklistPage  from '../pages/SecurityChecklist/SecurityChecklistPage'
import AlertsPage             from '../pages/Alerts/AlertsPage'
import HistoryPage            from '../pages/History/HistoryPage'

/** Redirects unauthenticated users to /login */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen bg-cyber-black"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyber-accent" /></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/** Redirects already-logged-in users away from auth pages */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected routes inside the app shell */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index                   element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"        element={<DashboardPage />} />
          <Route path="phishing"         element={<PhishingDetectionPage />} />
          <Route path="password"         element={<PasswordAnalyzerPage />} />
          <Route path="url-scanner"      element={<URLScannerPage />} />
          <Route path="chatbot"          element={<ChatbotPage />} />
          <Route path="recommendations"  element={<RecommendationsPage />} />
          <Route path="threat-score"     element={<ThreatScoringPage />} />
          <Route path="checklist"        element={<SecurityChecklistPage />} />
          <Route path="alerts"           element={<AlertsPage />} />
          <Route path="history"          element={<HistoryPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
