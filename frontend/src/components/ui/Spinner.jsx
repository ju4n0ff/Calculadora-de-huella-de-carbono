import PropTypes from 'prop-types'

export default function Spinner({ text = 'Cargando...' }) {
  return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-light)', marginTop: 16 }}>{text}</p>
    </div>
  )
}

Spinner.propTypes = {
  text: PropTypes.string,
}
