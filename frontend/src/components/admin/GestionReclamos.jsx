import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { reclamoApi, clienteApi } from '../../api'
import DataTable from '../ui/DataTable'
import PanelBlock from '../ui/PanelBlock'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

const estadoStyles = {
  pendiente: { background: '#fef3c7', color: '#92400e' },
  en_proceso: { background: '#dbeafe', color: '#1e40af' },
  resuelto: { background: '#d1fae5', color: '#065f46' },
}

const estadoLabels = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  resuelto: 'Resuelto',
}

export default function GestionReclamos({ addToast, adminId }) {
  const [reclamos, setReclamos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [respondiendo, setRespondiendo] = useState(null)
  const [respuesta, setRespuesta] = useState('')
  const [nuevoEstado, setNuevoEstado] = useState('resuelto')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [r, c] = await Promise.all([
        reclamoApi.listar(),
        clienteApi.listar(),
      ])
      setReclamos(r)
      setClientes(c)
    } catch {
      setError('Error al cargar reclamos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const getClienteName = (idCliente) => {
    const c = clientes.find((cl) => cl.idCliente === idCliente)
    return c ? c.nombre : `ID: ${idCliente}`
  }

  const handleResponder = async (id) => {
    if (!respuesta.trim()) return
    setSaving(true)
    try {
      await reclamoApi.responder(id, {
        respuesta,
        idAdministrador: adminId,
        estado: nuevoEstado,
      })
      addToast(`Reclamo respondido y marcado como "${estadoLabels[nuevoEstado]}".`)
      setRespondiendo(null)
      setRespuesta('')
      setNuevoEstado('resuelto')
      await load()
    } catch (err) {
      addToast('Error al responder: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  const rows = reclamos.map((r) => ({
    key: r.idReclamo,
    cells: [
      r.idReclamo,
      getClienteName(r.cliente?.idCliente),
      r.suministro ? `#${r.suministro.idSuministro}` : '—',
      <div key="desc" style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {r.descripcion}
      </div>,
      r.fecha,
      <span
        key="estado"
        className="badge"
        style={estadoStyles[r.estado] || estadoStyles.pendiente}
      >
        {estadoLabels[r.estado] || r.estado}
      </span>,
      <div key="acc" className="action-btns">
        {r.estado === 'pendiente' || r.estado === 'en_proceso' ? (
          <button
            className="btn btn-primary btn-xs"
            onClick={() => { setRespondiendo(r); setRespuesta(''); setNuevoEstado('resuelto') }}
          >
            Responder
          </button>
        ) : (
          <span style={{ color: 'var(--text-light)', fontSize: '0.82rem', fontWeight: 500 }}>
            {r.estado === 'resuelto' ? 'Resuelto ✓' : '—'}
          </span>
        )}
      </div>,
    ],
  }))

  return (
    <>
      <PanelBlock title="📋 Gestión de Reclamos">
        <div className="header-actions">
          <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>
            {reclamos.length} reclamo{reclamos.length !== 1 ? 's' : ''}
            {reclamos.filter((r) => r.estado === 'pendiente').length > 0 && (
              <span style={{ marginLeft: 8, color: '#92400e', background: '#fef3c7', padding: '2px 10px', borderRadius: 10, fontSize: '0.8rem' }}>
                {reclamos.filter((r) => r.estado === 'pendiente').length} pendiente(s)
              </span>
            )}
            {reclamos.filter((r) => r.estado === 'en_proceso').length > 0 && (
              <span style={{ marginLeft: 8, color: '#1e40af', background: '#dbeafe', padding: '2px 10px', borderRadius: 10, fontSize: '0.8rem' }}>
                {reclamos.filter((r) => r.estado === 'en_proceso').length} en proceso
              </span>
            )}
          </span>
        </div>
        <ErrorBanner message={error} onRetry={load} />
        {loading ? (
          <Spinner text="Cargando reclamos..." />
        ) : (
          <DataTable
            headers={['ID', 'Cliente', 'Suministro', 'Descripción', 'Fecha', 'Estado', 'Acción']}
            rows={rows}
            emptyMessage="No hay reclamos registrados."
          />
        )}
      </PanelBlock>

      {respondiendo && (
        <div className="modal-overlay" onClick={() => !saving && setRespondiendo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Responder Reclamo #{respondiendo.idReclamo}</h3>
            <div style={{ background: 'var(--ld-blue-light)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: '0.9rem', lineHeight: 1.5 }}>
              <strong>Cliente:</strong> {getClienteName(respondiendo.cliente?.idCliente)}<br />
              <strong>Descripción:</strong> {respondiendo.descripcion}
            </div>
            <div className="form-group">
              <label>Tu respuesta</label>
              <textarea
                className="form-control"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                rows={4}
                placeholder="Escribe tu respuesta al cliente..."
              />
            </div>
            <div className="form-group">
              <label>Estado después de responder</label>
              <select
                className="form-control"
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
              >
                <option value="resuelto">Resuelto — problema solucionado</option>
                <option value="en_proceso">En Proceso — se necesita más revisión</option>
                <option value="pendiente">Pendiente — esperando más información</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost btn-md" onClick={() => setRespondiendo(null)} disabled={saving}>
                Cancelar
              </button>
              <button
                className="btn btn-primary btn-md"
                onClick={() => handleResponder(respondiendo.idReclamo)}
                disabled={saving || !respuesta.trim()}
              >
                {saving ? 'Enviando...' : `Responder y marcar como ${estadoLabels[nuevoEstado]}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

GestionReclamos.propTypes = {
  addToast: PropTypes.func.isRequired,
  adminId: PropTypes.number.isRequired,
}
