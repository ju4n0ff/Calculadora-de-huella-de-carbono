import PropTypes from 'prop-types'

export default function ApplianceGrid({ artefactos, selected, onToggle }) {
  if (!artefactos.length) return null
  return (
    <div className="matrix-container">
      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ld-blue)', display: 'block', marginBottom: 10 }}>
        Selecciona los artefactos para simular el consumo:
      </label>
      <div className="matrix-grid">
        {artefactos.map((a) => (
          <div
            key={a.id}
            className={`appliance-btn ${selected.has(a.id) ? 'selected' : ''}`}
            onClick={() => onToggle(a.id)}
          >
            <span className="icon">{a.icon || '🔌'}</span>
            <span>{a.nombre}</span>
            <small>{a.watts}W</small>
          </div>
        ))}
      </div>
    </div>
  )
}

ApplianceGrid.propTypes = {
  artefactos: PropTypes.array.isRequired,
  selected: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
}
