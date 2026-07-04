import { AuthProvider } from './contexts/AuthContext'
import { AlertProvider } from './contexts/AlertContext'
import AppRouter         from './router/AppRouter'
import ToastContainer    from './components/common/ToastContainer'

/**
 * Root App component.
 * Wraps the entire tree in context providers.
 */
export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <ToastContainer />
        <AppRouter />
      </AlertProvider>
    </AuthProvider>
  )
}
