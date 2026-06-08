import PropTypes from 'prop-types'

export default function MetricCard({ icon, title, value, footer, alert = false }) {
  return (
    <div className={`metric-card ${alert ? 'alert' : ''}`}>
      {icon && <span className="metric-icon">{icon}</span>}
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      {footer && <div className="metric-footer">{footer}</div>}
    </div>
  )
}

MetricCard.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  footer: PropTypes.string,
  alert: PropTypes.bool,
}
