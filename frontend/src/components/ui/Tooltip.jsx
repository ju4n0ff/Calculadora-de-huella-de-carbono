import { useState } from 'react'

export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false)

  const positions = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 },
  }

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span style={{
          position: 'absolute', ...(positions[position] || positions.top),
          background: 'var(--ld-blue)', color: '#fff',
          padding: '6px 10px', borderRadius: 6, fontSize: '0.75rem',
          fontWeight: 600, whiteSpace: 'nowrap', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          pointerEvents: 'none', animation: 'fadeIn 0.15s ease-out',
        }}>
          {text}
        </span>
      )}
    </span>
  )
}
