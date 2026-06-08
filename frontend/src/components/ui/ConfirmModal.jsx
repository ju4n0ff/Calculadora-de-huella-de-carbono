import { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'primary', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  const btnStyle = variant === 'danger'
    ? { background: '#dc2626', color: '#fff' }
    : { background: 'var(--ld-blue)', color: '#fff' }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out',
    }} onClick={onCancel}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32,
        maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: 'var(--ld-blue)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.92rem', marginBottom: 24, lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px', borderRadius: 10, border: '2px solid #e2e8f0',
              background: 'transparent', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
              ...btnStyle,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'danger']),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
