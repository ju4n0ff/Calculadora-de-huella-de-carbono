import { useState, useCallback } from 'react'

export default function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, msg }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  return { toasts, addToast }
}
