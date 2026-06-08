import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuarioSesion')
      if (raw) {
        try {
          setUser(JSON.parse(raw))
        } catch {
          localStorage.removeItem('usuarioSesion')
        }
      }
    } catch {
      // localStorage no disponible (modo privado, etc.)
    }
    setLoading(false)
  }, [])

  const login = (tipo, datos) => {
    try {
      const session = { tipo, datos }
      localStorage.setItem('usuarioSesion', JSON.stringify(session))
      setUser(session)
    } catch {
      setUser({ tipo, datos })
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('usuarioSesion')
    } catch {
      // ignore
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
