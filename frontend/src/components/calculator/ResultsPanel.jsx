import PropTypes from 'prop-types'

export default function ResultsPanel({ totalKwh, costoSoles, co2Kg, hasResults }) {
  if (!hasResults) return null

  return (
    <div>
      <h3>📊 Resultados del Cálculo</h3>
      <div className="results-row">
        <div className="result-card highlight">
          <span className="result-icon">⚡</span>
          <div className="result-value">{totalKwh.toFixed(2)}</div>
          <span className="result-label">kWh / mes</span>
        </div>
        <div className="result-card">
          <span className="result-icon">💰</span>
          <div className="result-value">S/. {costoSoles.toFixed(2)}</div>
          <span className="result-label">Costo mensual</span>
        </div>
        <div className="result-card">
          <span className="result-icon">🌿</span>
          <div className="result-value">{co2Kg.toFixed(2)} kg</div>
          <span className="result-label">Huella de CO2</span>
        </div>
      </div>
    </div>
  )
}

ResultsPanel.propTypes = {
  totalKwh: PropTypes.number,
  costoSoles: PropTypes.number,
  co2Kg: PropTypes.number,
  hasResults: PropTypes.bool,
}
