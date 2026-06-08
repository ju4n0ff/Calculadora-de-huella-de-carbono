import PropTypes from 'prop-types'
import PanelBlock from '../ui/PanelBlock'
import DataTable from '../ui/DataTable'

export default function ConsumptionHistory({ consumos, loading, error }) {
  if (loading) {
    return (
      <PanelBlock title="⏳ Historial de Consumos Guardados">
        <p style={{ color: 'var(--text-light)' }}>Cargando consumos...</p>
      </PanelBlock>
    )
  }

  if (error) {
    return (
      <PanelBlock title="⏳ Historial de Consumos Guardados">
        <p style={{ color: '#c62828', background: '#ffebee', padding: 12, borderRadius: 12 }}>{error}</p>
      </PanelBlock>
    )
  }

  const rows = consumos.map((c) => ({
    key: c.idConsumo,
    cells: [
      <b key="id">CON-{c.idConsumo}</b>,
      c.fecha || 'Reciente',
      `${c.horasUso} hrs / ${c.dias} días`,
      <span key="kwh" style={{ color: 'var(--ld-blue)', fontWeight: 700 }}>{c.totalKwh.toFixed(2)} kWh</span>,
      `S/. ${c.costoTotal.toFixed(2)}`,
      `${c.huellaCarbono.toFixed(2)} kg`,
    ],
  }))

  return (
    <PanelBlock title="⏳ Historial de Consumos Guardados">
      <DataTable
        headers={['ID Consumo', 'Fecha Registro', 'Horas/Días', 'Total Consumido', 'Costo Calculado', 'Huella CO2']}
        rows={rows}
        emptyMessage="No hay registros de consumo guardados en la sesión actual."
      />
    </PanelBlock>
  )
}

ConsumptionHistory.propTypes = {
  consumos: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
}
