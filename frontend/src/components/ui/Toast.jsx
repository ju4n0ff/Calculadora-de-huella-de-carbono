import PropTypes from 'prop-types'

export default function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">{t.msg}</div>
      ))}
    </div>
  )
}

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    msg: PropTypes.string.isRequired,
  })),
}
