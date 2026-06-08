import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import ClientDashboard from './pages/ClientDashboard'
import AdminDashboard from './pages/AdminDashboard'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Cargando...</div>

  if (!user) return <Login />

  if (user.tipo === 'ADMIN') return <AdminDashboard />

  return <ClientDashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
