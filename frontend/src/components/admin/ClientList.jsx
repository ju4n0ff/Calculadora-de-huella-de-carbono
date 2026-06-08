import { useState } from 'react'
import PropTypes from 'prop-types'
import PanelBlock from '../ui/PanelBlock'
import DataTable from '../ui/DataTable'
import SearchInput from '../ui/SearchInput'

export default function ClientList({ clientes, consumos }) {
  const [search, setSearch] = useState('')

  const filtered = clientes.filter((c) =>
    !search || c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    String(c.idCliente).includes(search)
  )

  const rows = filtered.map((c) => {
    const consumosCliente = consumos.filter((con) => con.cliente?.idCliente === c.idCliente)
    const totalCliente = consumosCliente.reduce((s, con) => s + (con.totalKwh || 0), 0)
    const color = totalCliente > 300 ? '#991b1b' : totalCliente > 150 ? '#92400e' : '#065f46'
    return {
      key: c.idCliente,
      cells: [
        <b key="id">CLI-{c.idCliente}</b>,
        c.nombre,
        c.direccion || 'No registrada',
        <span key="tarifa" style={{ color: 'var(--ld-blue)', fontWeight: 700 }}>Tarifa {c.idTarifa}</span>,
        <span key="kwh" style={{ fontWeight: 700, color }}>
          {totalCliente.toFixed(2)} kWh
          <small style={{ color: 'var(--text-light)', marginLeft: 6 }}>({consumosCliente.length} registros)</small>
        </span>,
      ],
    }
  })

  return (
    <div className="panel-layout full-width">
      <PanelBlock title="👥 Directorio de Clientes y Consumos Vinculados">
        <div style={{ marginBottom: 16 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o ID..." />
        </div>
        <DataTable
          headers={['ID Cliente', 'Nombre Completo', 'Dirección', 'ID Tarifa', 'Total Consumido']}
          rows={rows}
          emptyMessage="No hay clientes registrados."
        />
      </PanelBlock>
    </div>
  )
}

ClientList.propTypes = {
  clientes: PropTypes.array.isRequired,
  consumos: PropTypes.array.isRequired,
}
