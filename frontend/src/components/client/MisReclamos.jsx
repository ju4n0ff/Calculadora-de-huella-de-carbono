import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { reclamoApi, suministroApi } from '../../api'
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

const borderVar = 'rgba(38, 49, 132, 0.12)'

export default function MisReclamos({ clienteId, addToast }) {
  const [reclamos, setReclamos] = useState([])
  const [suministros, setSuministros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [selectedSum, setSelectedSum] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [r, s] = await Promise.all([
        reclamoApi.listarPorCliente(clienteId),
        suministroApi.listarPorCliente(clienteId),
      ])
      setReclamos(r)
      setSuministros(s)
    } catch {
      setError('Error al cargar reclamos.')
    } finally {
      setLoading(false)
    }
  }, [clienteId])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!descripcion.trim()) return
    setSaving(true)
    try {
      const payload = {
        descripcion,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        cliente: { idCliente: clienteId },
      }
      if (selectedSum) {
        payload.suministro = { idSuministro: Number(selectedSum) }
      }
      await reclamoApi.crear(payload)
      addToast('Reclamo registrado correctamente.')
      setDescripcion('')
      setSelectedSum('')
      await load()
    } catch (err) {
      addToast('Error al registrar reclamo: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PanelBlock title="📝 Registrar Reclamo">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Suministro (opcional)</label>
            <select className="form-control" value={selectedSum} onChange={(e) => setSelectedSum(e.target.value)}>
              <option value="">— Selecciona un suministro —</option>
              {suministros.map((s) => (
                <option key={s.idSuministro} value={s.idSuministro}>
                  {s.codigoMedidor || `Suministro #${s.idSuministro}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Descripción del Reclamo</label>
            <textarea
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              placeholder="Describe tu reclamo o inconveniente..."
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving || !descripcion.trim()}
          >
            {saving ? 'Enviando...' : 'Enviar Reclamo'}
          </button>
        </form>
      </PanelBlock>

      <PanelBlock title="📋 Mis Reclamos" style={{ marginTop: 24 }}>
        <ErrorBanner message={error} onRetry={load} />
        {loading ? (
          <Spinner text="Cargando reclamos..." />
        ) : reclamos.length === 0 ? (
          <div className="empty-state">
            <span className="icon">📭</span>
            <p>No has registrado reclamos aún.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reclamos.map((r) => (
              <div
                key={r.idReclamo}
                style={{
                  background: '#fff', borderRadius: 14, padding: 18,
                  border: `1px solid ${borderVar}`, cursor: 'pointer',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
                onClick={() => setExpandedId(expandedId === r.idReclamo ? null : r.idReclamo)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ld-blue)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderVar; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--ld-blue)' }}>Reclamo #{r.idReclamo}</span>
                    <span style={{ marginLeft: 12, color: 'var(--text-light)', fontSize: '0.85rem' }}>{r.fecha}</span>
                  </div>
                  <span
                    className="badge"
                    style={estadoStyles[r.estado] || estadoStyles.pendiente}
                  >
                    {estadoLabels[r.estado] || r.estado}
                  </span>
                </div>
                <p style={{ marginTop: 8, color: 'var(--text-dark)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                  {r.descripcion}
                </p>

                {expandedId === r.idReclamo && r.estado === 'resuelto' && (
                  <div style={{
                    marginTop: 12, padding: 16, background: '#f0fdf4', borderRadius: 10,
                    border: '1px solid #bbf7d0',
                  }}>
                    <span style={{ fontWeight: 600, color: '#065f46', display: 'block', marginBottom: 6 }}>
                      Respuesta del Administrador:
                    </span>
                    <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {r.respuestaAdmin || 'Sin respuesta detallada.'}
                    </p>
                  </div>
                )}

                {expandedId === r.idReclamo && r.estado === 'en_proceso' && (
                  <div style={{
                    marginTop: 12, padding: 16, background: '#eff6ff', borderRadius: 10,
                    border: '1px solid #bfdbfe',
                  }}>
                    <span style={{ fontWeight: 600, color: '#1e40af', display: 'block', marginBottom: 6 }}>
                      Respuesta del Administrador:
                    </span>
                    <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {r.respuestaAdmin || 'Sin respuesta detallada.'}
                    </p>
                    <p style={{ marginTop: 8, fontSize: '0.85rem', color: '#1e40af', fontStyle: 'italic' }}>
                      Tu reclamo está siendo revisado. Te notificaremos cuando haya una actualización.
                    </p>
                  </div>
                )}

                {expandedId === r.idReclamo && r.estado === 'pendiente' && (
                  <p style={{ marginTop: 12, color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                    Pendiente de respuesta por parte del administrador.
                  </p>
                )}

                {expandedId !== r.idReclamo && (
                  <span style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: 4, display: 'block' }}>
                    Haz clic para ver detalles
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </PanelBlock>
    </>
  )
}

MisReclamos.propTypes = {
  clienteId: PropTypes.number.isRequired,
  addToast: PropTypes.func.isRequired,
}
