import PropTypes from 'prop-types'

export default function Badge({ variant = 'activo', children }) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  )
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['activo', 'evaluacion', 'bajo', 'medio', 'alto']),
  children: PropTypes.node,
}
