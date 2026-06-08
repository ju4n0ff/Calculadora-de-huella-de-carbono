import PropTypes from 'prop-types'

export default function PanelBlock({ title, children, style }) {
  return (
    <div className="panel-block" style={style}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}

PanelBlock.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
}
