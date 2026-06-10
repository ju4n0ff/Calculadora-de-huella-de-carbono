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
  const [processingId, setProcessingId] = useState(null)

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
    setProcessingId(id)
    try {
      await suministroApi.actualizarEstado(id, estado)
      addToast(`Suministro ${estado === 'activo' ? 'aprobado' : 'rechazado'} correctamente.`)
      await load()
    } catch (err) {
      addToast('Error al actualizar estado: ' + (err.message || 'desconocido'))
    } finally {
      setProcessingId(null)
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
        className="badge"
        style={estadoStyles[s.estado] || estadoStyles.pendiente}
      >
        {s.estado === 'activo' ? 'Activo' : s.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
      </span>,
      <div key="acc" className="action-btns">
        {s.estado === 'pendiente' ? (
          <>
            <button
              className="btn btn-success btn-xs"
              onClick={() => handleEstado(s.idSuministro, 'activo')}
              disabled={processingId === s.idSuministro}
            >
              {processingId === s.idSuministro ? '...' : 'Aprobar'}
            </button>
            <button
              className="btn btn-ghost-danger btn-xs"
              onClick={() => handleEstado(s.idSuministro, 'rechazado')}
              disabled={processingId === s.idSuministro}
            >
              {processingId === s.idSuministro ? '...' : 'Rechazar'}
            </button>
          </>
        ) : (
          <span style={{ color: 'var(--text-light)', fontSize: '0.82rem', fontWeight: 500 }}>
            Sin acciones
          </span>
        )}
      </div>,
    ],
  }))

  return (
    <PanelBlock title="🔌 Gestión de Suministros">
      <div className="header-actions">
        <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>
          {suministros.length} suministro{suministros.length !== 1 ? 's' : ''} registrado{suministros.length !== 1 ? 's' : ''}
          {suministros.filter((s) => s.estado === 'pendiente').length > 0 && (
            <span style={{ marginLeft: 8, color: '#92400e', background: '#fef3c7', padding: '2px 10px', borderRadius: 10, fontSize: '0.8rem' }}>
              {suministros.filter((s) => s.estado === 'pendiente').length} pendiente(s)
            </span>
          )}
        </span>
      </div>
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
