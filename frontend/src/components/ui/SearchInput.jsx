import PropTypes from 'prop-types'

export default function SearchInput({ value, onChange, placeholder = 'Buscar...', style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        fontSize: '0.9rem', color: 'var(--text-light)', pointerEvents: 'none',
      }}>
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 14px 10px 36px',
          border: '2px solid #e2e8f0', borderRadius: 10,
          fontSize: '0.88rem', fontWeight: 600, outline: 'none',
          color: 'var(--text-dark)', background: 'var(--ld-white)',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--ld-blue)'}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
}
