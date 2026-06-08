import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { consumoApi, suministroApi } from '../../api'
import PanelBlock from '../ui/PanelBlock'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

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
        <div className="form-group" style={{ maxWidth: 300 }}>
          <label>Filtrar por Suministro</label>
          <select value={selectedSum} onChange={(e) => setSelectedSum(e.target.value)}>
            {suministros.map((s) => (
              <option key={s.idSuministro} value={s.idSuministro}>
                {s.codigoMedidor || `Suministro #${s.idSuministro}`}
              </option>
            ))}
          </select>
        </div>
      )}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 40 }}>
          No hay consumos registrados para mostrar.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          {filtered.map((c) => (
            <div
              key={c.idConsumo}
              style={{
                background: '#fff', borderRadius: 16, padding: 24,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, color: 'var(--ld-blue)', fontSize: '1.1rem' }}>
                  Boleta CON-{c.idConsumo}
                </span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{c.fecha}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Consumo</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ld-blue)' }}>
                    {c.totalKwh?.toFixed(2)} kWh
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Costo Total</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669' }}>
                    S/. {c.costoTotal?.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Huella de CO₂</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#b45309' }}>
                    {c.huellaCarbono?.toFixed(2)} kg
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 24, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                <span>Horas de uso: {c.horasUso || '—'}</span>
                <span>Días: {c.dias || '—'}</span>
                <span>Suministro: #{c.suministro?.idSuministro || '—'}</span>
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
