import PropTypes from 'prop-types'

export default function SupplySelector({ suministros, suministroId, onChange, loading }) {
  return (
    <div className="config-form-group">
      <label htmlFor="selectSuministro">Asociar a Suministro Activo:</label>
      <select
        id="selectSuministro"
        className="config-select"
        value={suministroId}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Seleccionar --</option>
        {suministros.map((s) => (
          <option key={s.idSuministro} value={s.idSuministro}>
            SUM-{String(s.idSuministro).padStart(3, '0')} ({s.tipoConexion || 'Sin tipo'})
          </option>
        ))}
      </select>
      {suministros.length === 0 && !loading && (
        <small style={{ color: 'var(--text-light)' }}>No hay suministros disponibles.</small>
      )}
    </div>
  )
}

SupplySelector.propTypes = {
  suministros: PropTypes.array.isRequired,
  suministroId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}
