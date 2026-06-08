import PropTypes from 'prop-types'
import Tooltip from '../ui/Tooltip'

export default function ConfigPanel({ horas, dias, onHorasChange, onDiasChange, onMetodologia }) {
  const clampHoras = (val) => {
    const clamped = Math.max(1, Math.min(24, val || 1))
    onHorasChange(clamped)
  }

  const clampDias = (val) => {
    const clamped = Math.max(1, Math.min(31, val || 1))
    onDiasChange(clamped)
  }

  return (
    <div>
      <h3>⚙️ Parámetros de Red</h3>
      <div className="config-form-group">
        <label htmlFor="inputHoras">
          <Tooltip text="Cantidad de horas que usas el artefacto por día">
            Horas de uso diarias promedio <span style={{ color: 'var(--text-light)', fontWeight: 400, fontSize: '0.75rem' }}>(1–24)</span>:
          </Tooltip>
        </label>
        <input
          id="inputHoras"
          type="number"
          className="config-input"
          value={horas}
          min="1"
          max="24"
          step="1"
          onBlur={(e) => clampHoras(Number(e.target.value))}
          onChange={(e) => {
            const raw = Number(e.target.value)
            if (raw >= 1 && raw <= 24) onHorasChange(raw)
          }}
        />
      </div>
      <div className="config-form-group">
        <label htmlFor="inputDias">
          <Tooltip text="Cantidad de días al mes que usas los artefactos seleccionados">
            Días de uso estimados al mes <span style={{ color: 'var(--text-light)', fontWeight: 400, fontSize: '0.75rem' }}>(1–31)</span>:
          </Tooltip>
        </label>
        <input
          id="inputDias"
          type="number"
          className="config-input"
          value={dias}
          min="1"
          max="31"
          step="1"
          onBlur={(e) => clampDias(Number(e.target.value))}
          onChange={(e) => {
            const raw = Number(e.target.value)
            if (raw >= 1 && raw <= 31) onDiasChange(raw)
          }}
        />
      </div>
      {onMetodologia && (
        <button className="btn-flat-info" onClick={onMetodologia}>
          📖 Ver Metodología Ecológica
        </button>
      )}
    </div>
  )
}

ConfigPanel.propTypes = {
  horas: PropTypes.number.isRequired,
  dias: PropTypes.number.isRequired,
  onHorasChange: PropTypes.func.isRequired,
  onDiasChange: PropTypes.func.isRequired,
  onMetodologia: PropTypes.func,
}
