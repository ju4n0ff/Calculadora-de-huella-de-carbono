import PropTypes from 'prop-types'

const artefactos = [
  { id: 1, nombre: 'Foco LED', watts: 10, icon: '💡' },
  { id: 2, nombre: 'Televisor', watts: 120, icon: '📺' },
  { id: 3, nombre: 'Refrigeradora', watts: 300, icon: '❄️' },
  { id: 4, nombre: 'Laptop', watts: 65, icon: '💻' },
  { id: 5, nombre: 'Microondas', watts: 1000, icon: '🍿' },
  { id: 6, nombre: 'Lavadora', watts: 500, icon: '🧺' },
  { id: 7, nombre: 'Plancha', watts: 1200, icon: '👔' },
  { id: 8, nombre: 'Secadora', watts: 1800, icon: '💨' },
  { id: 9, nombre: 'Ducha eléctrica', watts: 4500, icon: '🚿' },
  { id: 10, nombre: 'Ventilador', watts: 80, icon: '🌀' },
  { id: 11, nombre: 'Aire acondicionado', watts: 1500, icon: '🥶' },
  { id: 12, nombre: 'Horno eléctrico', watts: 2000, icon: '🥧' },
  { id: 13, nombre: 'Cafetera', watts: 900, icon: '☕' },
  { id: 14, nombre: 'Licuadora', watts: 350, icon: '🥤' },
  { id: 15, nombre: 'Router', watts: 30, icon: '🌐' },
  { id: 16, nombre: 'Consola', watts: 160, icon: '🎮' },
  { id: 17, nombre: 'Aspiradora', watts: 1400, icon: '🧹' },
  { id: 18, nombre: 'Bomba de agua', watts: 750, icon: '🚰' },
  { id: 19, nombre: 'Cargador celular', watts: 10, icon: '🔌' },
  { id: 20, nombre: 'PC de escritorio', watts: 250, icon: '🖥️' },
]

export default function ApplianceGrid({ selected, onToggle }) {
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
            <span className="icon">{a.icon}</span>
            <span>{a.nombre}</span>
            <small>{a.watts}W</small>
          </div>
        ))}
      </div>
    </div>
  )
}

ApplianceGrid.propTypes = {
  selected: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
}

export { artefactos }