import PropTypes from 'prop-types'
import PanelBlock from '../ui/PanelBlock'
import DataTable from '../ui/DataTable'
import Badge from '../ui/Badge'

export default function SupplyList({ suministros, loading, error }) {
  if (loading) {
    return (
      <PanelBlock title="🔌 Suministros Vigentes Asociados">
        <p style={{ color: 'var(--text-light)' }}>Cargando suministros...</p>
      </PanelBlock>
    )
  }

  if (error) {
    return (
      <PanelBlock title="🔌 Suministros Vigentes Asociados">
        <p style={{ color: '#c62828', background: '#ffebee', padding: 12, borderRadius: 12 }}>{error}</p>
      </PanelBlock>
    )
  }

  const rows = suministros.map((s) => ({
    key: s.idSuministro,
    cells: [
      <b key="id">SUM-{String(s.idSuministro).padStart(3, '0')}</b>,
      s.codigoMedidor || 'Por Asignar',
      s.tipoConexion,
      `🌿 ${s.fuenteEnergia || 'Red Tradicional'}`,
      <Badge key="estado" variant={s.estado === 'Activo' ? 'activo' : 'evaluacion'}>
        ● {s.estado}
      </Badge>,
    ],
  }))

  return (
    <PanelBlock title="🔌 Suministros Vigentes Asociados" style={{ marginBottom: 24 }}>
      <DataTable
        headers={['ID Suministro', 'Código Medidor', 'Tipo Conexión', 'Fuente Energía', 'Estado Operativo']}
        rows={rows}
        emptyMessage="No posee suministros vigentes."
      />
    </PanelBlock>
  )
}

SupplyList.propTypes = {
  suministros: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
}
