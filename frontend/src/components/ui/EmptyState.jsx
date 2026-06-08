import PropTypes from 'prop-types'

export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 20px',
      background: '#fff',
      borderRadius: 16,
      border: '2px dashed #e2e8f0',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{icon}</div>
      {title && <h4 style={{ color: 'var(--ld-blue)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{title}</h4>}
      {description && <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 16 }}>{description}</p>}
      {action && action}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
}
