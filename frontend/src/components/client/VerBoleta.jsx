import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { consumoApi, suministroApi } from '../../api'
import PanelBlock from '../ui/PanelBlock'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

const borderVar = 'rgba(38, 49, 132, 0.12)'

export default function VerBoleta({ clienteId }) {
  const [consumos, setConsumos] = useState([])
  const [suministros, setSuministros] = useState([])
  const [selectedSum, setSelectedSum] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [cons, sums] = await Promise.all([
        consumoApi.listarPorCliente(clienteId),
        suministroApi.listarPorCliente(clienteId),
      ])
      setConsumos(cons)
      setSuministros(sums)
      if (sums.length > 0 && !selectedSum) {
        setSelectedSum(String(sums[0].idSuministro))
      }
    } catch {
      setError('Error al cargar datos.')
    } finally {
      setLoading(false)
    }
  }, [clienteId])

  useEffect(() => { load() }, [load])

  const filtered = selectedSum
    ? consumos.filter((c) => c.suministro?.idSuministro === Number(selectedSum))
    : consumos

  if (loading) return <Spinner text="Cargando boletas..." />

  return (
    <PanelBlock title="📄 Ver Boleta de Consumo">
      <ErrorBanner message={error} onRetry={load} />

      {suministros.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'end', gap: 12, marginBottom: 20,
          flexWrap: 'wrap',
        }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 260 }}>
            <label>Filtrar por Suministro</label>
            <select
              className="form-control"
              value={selectedSum}
              onChange={(e) => setSelectedSum(e.target.value)}
            >
              {suministros.map((s) => (
                <option key={s.idSuministro} value={s.idSuministro}>
                  {s.codigoMedidor || `Suministro #${s.idSuministro}`} — {s.tipoConexion}
                </option>
              ))}
            </select>
          </div>
          {selectedSum && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectedSum('')}
            >
              Limpiar filtro
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="icon">📭</span>
          <p>No hay consumos registrados para mostrar.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          {filtered.map((c) => (
            <div
              key={c.idConsumo}
              style={{
                background: '#fff', borderRadius: 16, padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: `1px solid ${borderVar}`,
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, color: 'var(--ld-blue)', fontSize: '1.1rem' }}>
                  Boleta CON-{c.idConsumo}
                </span>
                <span style={{
                  background: 'var(--ld-blue-light)',
                  padding: '4px 14px',
                  borderRadius: 20,
                  color: 'var(--ld-blue)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}>
                  {c.fecha}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--ld-white)', borderRadius: 12, border: `1px solid ${borderVar}` }}>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Consumo</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ld-blue)', marginTop: 4 }}>
                    {c.totalKwh?.toFixed(2)} kWh
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--ld-white)', borderRadius: 12, border: `1px solid ${borderVar}` }}>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Costo Total</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginTop: 4 }}>
                    S/. {c.costoTotal?.toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--ld-white)', borderRadius: 12, border: `1px solid ${borderVar}` }}>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Huella CO₂</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309', marginTop: 4 }}>
                    {c.huellaCarbono?.toFixed(2)} kg
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${borderVar}`, display: 'flex', gap: 24, fontSize: '0.85rem', color: 'var(--text-light)', flexWrap: 'wrap' }}>
                <span><strong style={{ color: 'var(--text-dark)' }}>Horas:</strong> {c.horasUso || '—'}</span>
                <span><strong style={{ color: 'var(--text-dark)' }}>Días:</strong> {c.dias || '—'}</span>
                <span><strong style={{ color: 'var(--text-dark)' }}>Suministro:</strong> #{c.suministro?.idSuministro || '—'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelBlock>
  )
}

VerBoleta.propTypes = {
  clienteId: PropTypes.number.isRequired,
}
