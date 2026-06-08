import { lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Spinner from './components/ui/Spinner'
import ErrorBoundary from './components/ui/ErrorBoundary'

const Login = lazy(() => import('./pages/Login'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'))

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Cargando...</div>

  return (
    <Suspense fallback={<Spinner text="Cargando módulo..." />}>
      {!user ? <Login /> : user.tipo === 'ADMIN' ? <AdminDashboard /> : <ClientDashboard />}
    </Suspense>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}
