import PropTypes from 'prop-types'
import PanelBlock from '../ui/PanelBlock'
import DataTable from '../ui/DataTable'

export default function CO2Report({ consumos, simulaciones, getClienteName }) {
  const rows = [
    ...consumos.map((c) => {
      let badge
      if (c.totalKwh < 150) badge = <span className="badge badge-bajo">🟢 Bajo Consumo</span>
      else if (c.totalKwh <= 300) badge = <span className="badge badge-medio">🟡 Moderado</span>
      else badge = <span className="badge badge-alto">🔴 Alto Riesgo</span>
      return {
        key: `con-${c.idConsumo}`,
        cells: [
          <b key="id">CON-{c.idConsumo}</b>,
          c.fecha || 'Reciente',
          getClienteName(c.cliente?.idCliente),
          `${c.totalKwh.toFixed(2)} kWh`,
          <b key="co2">{c.huellaCarbono.toFixed(2)} kg CO2</b>,
          badge,
        ],
      }
    }),
    ...simulaciones.map((s) => {
      let badge
      if (s.energiaKwh < 150) badge = <span className="badge badge-bajo">🟢 Bajo Consumo</span>
      else if (s.energiaKwh <= 300) badge = <span className="badge badge-medio">🟡 Moderado</span>
      else badge = <span className="badge badge-alto">🔴 Alto Riesgo</span>
      return {
        key: `sim-${s.id}`,
        cells: [
          <b key="id">SIM-{s.id}</b>,
          s.fechaRegistro ? new Date(s.fechaRegistro).toLocaleDateString() : 'Reciente',
          s.usuario?.nombre || `Usuario ID: ${s.usuario?.id}`,
          `${s.energiaKwh?.toFixed(2)} kWh`,
          <b key="co2">{s.co2Kg?.toFixed(2)} kg CO2</b>,
          badge,
        ],
      }
    }),
  ]

  return (
    <div className="panel-layout full-width">
      <PanelBlock title="🌿 Semáforo de Control Ambiental e Indicadores de Carbono">
        <DataTable
          headers={['ID Registro', 'Fecha', 'Cliente', 'Total (kWh)', 'Huella Carbono', 'Semáforo Ecológico']}
          rows={rows}
          emptyMessage="No hay registros de consumo para mostrar."
        />
      </PanelBlock>
    </div>
  )
}

CO2Report.propTypes = {
  consumos: PropTypes.array.isRequired,
  simulaciones: PropTypes.array.isRequired,
  getClienteName: PropTypes.func.isRequired,
}
