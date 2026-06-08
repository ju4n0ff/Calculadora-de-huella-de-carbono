import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { reclamoApi, clienteApi } from '../../api'
import DataTable from '../ui/DataTable'
import PanelBlock from '../ui/PanelBlock'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

const estadoStyles = {
  pendiente: { background: '#fef3c7', color: '#92400e' },
  respondido: { background: '#d1fae5', color: '#065f46' },
}

export default function GestionReclamos({ addToast, adminId }) {
  const [reclamos, setReclamos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [respondiendo, setRespondiendo] = useState(null)
  const [respuesta, setRespuesta] = useState('')
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
      await reclamoApi.responder(id, { respuesta, idAdministrador: adminId })
      addToast('Respuesta enviada correctamente.')
      setRespondiendo(null)
      setRespuesta('')
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
        style={{
          ...estadoStyles[r.estado] || estadoStyles.pendiente,
          padding: '3px 12px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem', display: 'inline-block',
        }}
      >
        {r.estado}
      </span>,
      <div key="accion">
        {r.estado === 'pendiente' ? (
          <button
            className="btn-primary"
            onClick={() => { setRespondiendo(r); setRespuesta('') }}
            style={{ padding: '4px 14px', fontSize: '0.8rem' }}
          >
            Responder
          </button>
        ) : (
          <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
            {r.respuestaAdmin ? 'Respondido' : '—'}
          </span>
        )}
      </div>,
    ],
  }))

  return (
    <>
      <PanelBlock title="📋 Gestión de Reclamos">
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
            <h3 style={{ color: 'var(--ld-blue)', marginBottom: 8 }}>Responder Reclamo #{respondiendo.idReclamo}</h3>
            <p style={{ color: 'var(--text-dark)', marginBottom: 16, lineHeight: 1.5 }}>
              <strong>Cliente:</strong> {getClienteName(respondiendo.cliente?.idCliente)}
              <br />
              <strong>Descripción:</strong> {respondiendo.descripcion}
            </p>
            <div className="form-group">
              <label>Tu respuesta</label>
              <textarea
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                rows={4}
                placeholder="Escribe tu respuesta al cliente..."
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-secondary" onClick={() => setRespondiendo(null)} disabled={saving}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={() => handleResponder(respondiendo.idReclamo)}
                disabled={saving || !respuesta.trim()}
              >
                {saving ? 'Enviando...' : 'Enviar Respuesta'}
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
