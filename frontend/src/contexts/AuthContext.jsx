import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('usuarioSesion')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        localStorage.removeItem('usuarioSesion')
      }
    }
    setLoading(false)
  }, [])

  const login = (tipo, datos) => {
    const session = { tipo, datos }
    localStorage.setItem('usuarioSesion', JSON.stringify(session))
    setUser(session)
  }

  const logout = () => {
    localStorage.removeItem('usuarioSesion')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
