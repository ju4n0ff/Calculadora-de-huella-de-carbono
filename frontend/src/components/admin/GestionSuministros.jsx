import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { suministroApi, clienteApi } from '../../api'
import DataTable from '../ui/DataTable'
import PanelBlock from '../ui/PanelBlock'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

const estadoStyles = {
  pendiente: { background: '#fef3c7', color: '#92400e' },
  activo: { background: '#d1fae5', color: '#065f46' },
  rechazado: { background: '#fee2e2', color: '#991b1b' },
}

export default function GestionSuministros({ addToast }) {
  const [suministros, setSuministros] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [s, c] = await Promise.all([
        suministroApi.listarTodos(),
        clienteApi.listar(),
      ])
      setSuministros(s)
      setClientes(c)
    } catch {
      setError('Error al cargar suministros.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleEstado = async (id, estado) => {
    try {
      await suministroApi.actualizarEstado(id, estado)
      addToast(`Suministro ${estado === 'activo' ? 'aprobado' : 'rechazado'} correctamente.`)
      await load()
    } catch (err) {
      addToast('Error al actualizar estado: ' + (err.message || 'desconocido'))
    }
  }

  const getClienteName = (idCliente) => {
    const c = clientes.find((cl) => cl.idCliente === idCliente)
    return c ? c.nombre : `ID: ${idCliente}`
  }

  const rows = suministros.map((s) => ({
    key: s.idSuministro,
    cells: [
      s.idSuministro,
      getClienteName(s.cliente?.idCliente),
      s.codigoMedidor || '—',
      s.tipoConexion || '—',
      s.fuenteEnergia || '—',
      <span
        key="estado"
        style={{
          ...estadoStyles[s.estado] || estadoStyles.pendiente,
          padding: '3px 12px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem', display: 'inline-block',
        }}
      >
        {s.estado}
      </span>,
      <div key="acciones" style={{ display: 'flex', gap: 6 }}>
        {s.estado === 'pendiente' && (
          <>
            <button
              className="btn-primary"
              onClick={() => handleEstado(s.idSuministro, 'activo')}
              style={{ padding: '4px 14px', fontSize: '0.8rem' }}
            >
              Aprobar
            </button>
            <button
              className="btn-flat-danger"
              onClick={() => handleEstado(s.idSuministro, 'rechazado')}
              style={{ padding: '4px 14px', fontSize: '0.8rem' }}
            >
              Rechazar
            </button>
          </>
        )}
        {s.estado !== 'pendiente' && <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>—</span>}
      </div>,
    ],
  }))

  return (
    <PanelBlock title="🔌 Gestión de Suministros">
      <ErrorBanner message={error} onRetry={load} />
      {loading ? (
        <Spinner text="Cargando suministros..." />
      ) : (
        <DataTable
          headers={['ID', 'Cliente', 'Medidor', 'Conexión', 'Fuente', 'Estado', 'Acciones']}
          rows={rows}
          emptyMessage="No hay suministros registrados."
        />
      )}
    </PanelBlock>
  )
}

GestionSuministros.propTypes = {
  addToast: PropTypes.func.isRequired,
}
