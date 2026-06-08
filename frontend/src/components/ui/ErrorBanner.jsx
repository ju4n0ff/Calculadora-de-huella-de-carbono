import PropTypes from 'prop-types'

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div style={{
      background: '#ffebee', color: '#c62828', padding: 14, borderRadius: 12,
      marginBottom: 20, border: '1px solid #ffcdd2', fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
    }}>
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: '6px 16px', border: '1px solid #c62828', borderRadius: 8,
          background: 'transparent', cursor: 'pointer', fontWeight: 600,
          color: '#c62828', whiteSpace: 'nowrap', fontSize: '0.85rem'
        }}>
          Reintentar
        </button>
      )}
    </div>
  )
}

ErrorBanner.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
}
