import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../api'

export default function Login() {
  const { login } = useAuth()
  const [role, setRole] = useState('CLIENTE')
  const [clienteId, setClienteId] = useState('')
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (role === 'CLIENTE') {
        const data = await authApi.loginCliente(clienteId)
        login('CLIENTE', data)
      } else {
        const data = await authApi.loginAdmin(adminUser, adminPass)
        login('ADMIN', data)
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-body">
      <div className="login-container">
        <header className="login-header">
          <div className="brand-icon">⚡</div>
          <h2>PowerCalc</h2>
          <p>Gestión Energética Inteligente</p>
        </header>

        <div className="role-selector">
          <label className="role-option">
            <input type="radio" name="role" value="CLIENTE" checked={role === 'CLIENTE'} onChange={() => setRole('CLIENTE')} />
            Cliente
          </label>
          <label className="role-option">
            <input type="radio" name="role" value="ADMIN" checked={role === 'ADMIN'} onChange={() => setRole('ADMIN')} />
            Administrador
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {role === 'CLIENTE' ? (
            <div className="form-group">
              <label htmlFor="clienteId">Código de Cliente:</label>
              <input id="clienteId" type="number" className="form-control" placeholder="Ej. 41206" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="adminUser">Usuario:</label>
                <input id="adminUser" type="text" className="form-control" placeholder="Ej. admin" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="adminPass">Clave:</label>
                <input id="adminPass" type="password" className="form-control" placeholder="Ingrese su contraseña" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} required />
              </div>
            </>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
