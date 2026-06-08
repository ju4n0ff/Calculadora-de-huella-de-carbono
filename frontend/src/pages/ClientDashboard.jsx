import { useState, useEffect, useRef, useCallback } from 'react'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { useAuth } from '../contexts/AuthContext'
import { suministroApi, consumoApi, artefactoApi } from '../api'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const artefactos = [
  { id: 1, nombre: 'Foco LED', watts: 10, icon: '💡' },
  { id: 2, nombre: 'Televisor', watts: 120, icon: '📺' },
  { id: 3, nombre: 'Refrigeradora', watts: 300, icon: '❄️' },
  { id: 4, nombre: 'Laptop', watts: 65, icon: '💻' },
  { id: 5, nombre: 'Microondas', watts: 1000, icon: '🍿' },
  { id: 6, nombre: 'Lavadora', watts: 500, icon: '🧺' },
  { id: 7, nombre: 'Plancha', watts: 1200, icon: '👔' },
  { id: 8, nombre: 'Secadora', watts: 1800, icon: '💨' },
  { id: 9, nombre: 'Ducha eléctrica', watts: 4500, icon: '🚿' },
  { id: 10, nombre: 'Ventilador', watts: 80, icon: '🌀' },
  { id: 11, nombre: 'Aire acondicionado', watts: 1500, icon: '🥶' },
  { id: 12, nombre: 'Horno eléctrico', watts: 2000, icon: '🥧' },
  { id: 13, nombre: 'Cafetera', watts: 900, icon: '☕' },
  { id: 14, nombre: 'Licuadora', watts: 350, icon: '🥤' },
  { id: 15, nombre: 'Router', watts: 30, icon: '🌐' },
  { id: 16, nombre: 'Consola', watts: 160, icon: '🎮' },
  { id: 17, nombre: 'Aspiradora', watts: 1400, icon: '🧹' },
  { id: 18, nombre: 'Bomba de agua', watts: 750, icon: '🚰' },
  { id: 19, nombre: 'Cargador celular', watts: 10, icon: '🔌' },
  { id: 20, nombre: 'PC de escritorio', watts: 250, icon: '🖥️' },
]

const PRECIO_KWH = 0.68
const FACTOR_CO2 = 0.21

const panels = [
  { id: 'dashboard', label: '📊 Mi Dashboard' },
  { id: 'simulador', label: '⚡ Simulador de Carga' },
  { id: 'suministros', label: '🔌 Mis Suministros' },
]

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const [activePanel, setActivePanel] = useState('dashboard')
  const [selected, setSelected] = useState(new Set())
  const [horas, setHoras] = useState(4)
  const [dias, setDias] = useState(30)
  const [suministroId, setSuministroId] = useState('')
  const [terminal, setTerminal] = useState('--- Sistema listo. Selecciona componentes y presiona "Ejecutar Análisis Técnico" ---')
  const [analisisValido, setAnalisisValido] = useState(false)
  const [store, setStore] = useState({ totalKwh: 0, costoSoles: 0, co2Kg: 0 })

  const [suministros, setSuministros] = useState([])
  const [consumos, setConsumos] = useState([])
  const [loadingSum, setLoadingSum] = useState(false)
  const [loadingCons, setLoadingCons] = useState(false)
  const [sumError, setSumError] = useState('')
  const [consError, setConsError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  const clienteId = user?.datos?.idCliente
  const clienteNombre = user?.datos?.nombre || 'Cliente'

  const addToast = useCallback((msg) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  useEffect(() => {
    if (activePanel === 'suministros') {
      setLoadingSum(true)
      setSumError('')
      suministroApi.listarPorCliente(clienteId)
        .then((data) => { setSuministros(data); if (data.length > 0) setSuministroId(String(data[0].idSuministro)) })
        .catch(() => setSumError('No se pudieron cargar los suministros. Verifica la conexión con el servidor.'))
        .finally(() => setLoadingSum(false))

      setLoadingCons(true)
      setConsError('')
      consumoApi.listarPorCliente(clienteId)
        .then(setConsumos)
        .catch(() => setConsError('No se pudieron cargar los consumos.'))
        .finally(() => setLoadingCons(false))
    }
  }, [activePanel, clienteId])

  useEffect(() => {
    if (activePanel === 'dashboard') {
      const canvas = chartRef.current
      if (!canvas) return
      if (chartInstance.current) chartInstance.current.destroy()
      const ctx = canvas.getContext('2d')
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Consumo Base', 'Mes Actual (Simulado)'],
          datasets: [{
            label: 'Consumo kWh',
            data: [84.0, store.totalKwh || 0],
            backgroundColor: ['#26a69a', '#ffb300'],
            borderRadius: 8,
          }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      })
      return () => { if (chartInstance.current) chartInstance.current.destroy() }
    }
  }, [activePanel, store])

  const toggleAppliance = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const ejecutarAnalisis = () => {
    if (selected.size === 0) {
      setTerminal('[ALERTA] Por favor, selecciona al menos un artefacto tecnológico para efectuar el cálculo de red.')
      setAnalisisValido(false)
      return
    }
    const seleccionados = artefactos.filter((a) => selected.has(a.id))
    const totalWatts = seleccionados.reduce((sum, a) => sum + a.watts, 0)
    const totalKwhMes = (totalWatts * horas * dias) / 1000
    const costoSoles = totalKwhMes * PRECIO_KWH
    const co2Kg = totalKwhMes * FACTOR_CO2

    setStore({ totalKwh: totalKwhMes, costoSoles, co2Kg })
    setAnalisisValido(true)

    const listaNombres = seleccionados.map((a) => a.nombre)
    setTerminal(
      `======================================================================\n` +
      `       📊 REPORTE TÉCNICO DE CONSUMO - MACO DEL SISTEMA               \n` +
      `======================================================================\n` +
      `• Componentes Analizados: ${listaNombres.join(', ')}\n` +
      `• Potencia de Carga Agrupada: ${(totalWatts / 1000).toFixed(3)} kW\n` +
      `• Régimen Configurado: ${horas} horas/día por ${dias} días al mes\n` +
      `----------------------------------------------------------------------\n` +
      `⚡ ENERGÍA TOTAL MENSUAL:   ${totalKwhMes.toFixed(2)} kWh\n` +
      `💰 COSTO ESTIMADO (BT5B):   S/. ${costoSoles.toFixed(2)}\n` +
      `🌿 INFLUENCIA DE CARBONO:   ${co2Kg.toFixed(2)} kg de CO2 emitidos\n` +
      `----------------------------------------------------------------------\n` +
      `✅ [ANÁLISIS COMPLETADO] Datos listos para persistencia en base de datos.`
    )
  }

  const mostrarMetodologia = () => {
    setTerminal(
      `======================================================================\n` +
      `               MÉTODO DE ANÁLISIS DE ENERGÍA Y CO2                   \n` +
      `======================================================================\n\n` +
      `1. Consumo Mensual = (Potencia en Watts x Horas Uso x Días) / 1000\n` +
      `2. Importe Económico (S/.) = Consumo Mensual (kWh) x S/. 0.68\n` +
      `3. Huella Ecológica (kgCO2) = Consumo Mensual (kWh) x 0.21`
    )
  }

  const guardarConsumo = async () => {
    if (!analisisValido || !suministroId) return
    setSaving(true)
    try {
      const payload = {
        cliente: { idCliente: clienteId },
        suministro: { idSuministro: parseInt(suministroId) },
        horasUso: horas,
        dias,
        totalKwh: store.totalKwh,
        costoTotal: store.costoSoles,
        huellaCarbono: store.co2Kg,
        fecha: new Date().toISOString().split('T')[0],
      }
      await consumoApi.guardar(payload)
      addToast('¡Consumo guardado exitosamente en la base de datos!')
      setAnalisisValido(false)

      const updated = await consumoApi.listarPorCliente(clienteId)
      setConsumos(updated)

      setActivePanel('suministros')
    } catch (err) {
      addToast('Error al guardar el consumo: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand"><span>🌱</span> Sistema EcoGlow</div>
        <ul className="sidebar-menu">
          {panels.map((p) => (
            <li key={p.id}>
              <a className={activePanel === p.id ? 'active' : ''} onClick={() => setActivePanel(p.id)}>
                {p.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={logout}>🚪 Cerrar Sesión</button>
        </div>
      </aside>

      <main className="main-workspace">
        <header className="topbar">
          <div className="topbar-title">
            <h2>{panels.find((p) => p.id === activePanel)?.label}</h2>
          </div>
          <div className="user-profile">
            <span>Hola, {clienteNombre}</span>
            <div className="user-avatar">✨</div>
          </div>
        </header>

        {activePanel === 'dashboard' && (
          <div className="active-panel">
            <div className="overview-grid">
              <div className="metric-card">
                <div className="metric-title">Último Consumo Calculado</div>
                <div className="metric-value">{store.totalKwh.toFixed(2)} kWh</div>
                <div className="metric-footer">📊 Registrado en la base de datos</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Costo Económico Acumulado</div>
                <div className="metric-value">S/. {store.costoSoles.toFixed(2)}</div>
                <div className="metric-footer">💵 Basado en tarifa asignada</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Huella Ecológica Generada</div>
                <div className="metric-value">{store.co2Kg.toFixed(2)} kg CO2</div>
                <div className="metric-footer">🌿 Indicador ambiental total</div>
              </div>
            </div>
            <div className="panel-layout full-width">
              <div className="panel-block">
                <h3>📈 Historial de Consumo Energético</h3>
                <div className="chart-container">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'simulador' && (
          <div className="active-panel">
            <div className="panel-layout">
              <div className="panel-block">
                <h3>⚡ Modelador Técnico de Carga y Consumo</h3>
                <div className="matrix-container">
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--jade-dark)' }}>
                    Selecciona los artefactos tecnológicos para simular el consumo:
                  </label>
                  <div className="matrix-grid">
                    {artefactos.map((a) => (
                      <div key={a.id} className={`appliance-btn ${selected.has(a.id) ? 'selected' : ''}`} onClick={() => toggleAppliance(a.id)}>
                        <span className="icon">{a.icon}</span>
                        <span>{a.nombre}</span>
                        <small style={{ color: 'var(--text-light)', fontSize: '0.7rem' }}>{a.watts}W</small>
                      </div>
                    ))}
                  </div>
                </div>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--jade-dark)', display: 'block', marginBottom: 8 }}>
                  Terminal de Diagnóstico de Red:
                </label>
                <div className="terminal-box">{terminal}</div>
              </div>

              <div className="panel-block">
                <h3>⚙️ Parámetros de Red</h3>
                <div className="config-form-group">
                  <label htmlFor="inputHoras">Horas de uso diarias promedio:</label>
                  <input id="inputHoras" type="number" className="config-input" value={horas} min="1" max="24" onChange={(e) => setHoras(Number(e.target.value))} />
                </div>
                <div className="config-form-group">
                  <label htmlFor="inputDias">Días de uso estimados al mes:</label>
                  <input id="inputDias" type="number" className="config-input" value={dias} min="1" max="31" onChange={(e) => setDias(Number(e.target.value))} />
                </div>
                <div className="config-form-group">
                  <label htmlFor="selectSuministro">Asociar a Suministro Activo:</label>
                  <select id="selectSuministro" className="config-select" value={suministroId} onChange={(e) => setSuministroId(e.target.value)}>
                    <option value="">-- Seleccionar --</option>
                    {suministros.map((s) => (
                      <option key={s.idSuministro} value={s.idSuministro}>
                        SUM-{String(s.idSuministro).padStart(3, '0')} ({s.tipoConexion || 'Sin tipo'})
                      </option>
                    ))}
                  </select>
                  {suministros.length === 0 && !loadingSum && (
                    <small style={{ color: 'var(--text-light)' }}>No hay suministros disponibles. Ve a "Mis Suministros" para ver más.</small>
                  )}
                </div>
                <button className="btn-flat-info" onClick={mostrarMetodologia}>📖 Ver Metodología Ecológica</button>
                <button className="btn-action-primary" onClick={ejecutarAnalisis}>⚙️ Ejecutar Análisis Técnico</button>
                <button className="btn-action-secondary" disabled={!analisisValido || !suministroId || saving} onClick={guardarConsumo}>
                  {saving ? 'Guardando...' : '💾 Guardar consumo en Base de Datos'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'suministros' && (
          <div className="active-panel">
            <div className="panel-block" style={{ marginBottom: 30 }}>
              <h3>🔌 Suministros Vigentes Asociados</h3>
              {loadingSum ? (
                <p style={{ color: 'var(--text-light)' }}>Cargando suministros...</p>
              ) : sumError ? (
                <p style={{ color: '#c62828', background: '#ffebee', padding: 12, borderRadius: 12 }}>{sumError}</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID Suministro</th>
                      <th>Código Medidor</th>
                      <th>Tipo Conexión</th>
                      <th>Fuente Energía</th>
                      <th>Estado Operativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suministros.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-light)', padding: 20 }}>
                          No posee suministros vigentes.
                        </td>
                      </tr>
                    ) : (
                      suministros.map((s) => (
                        <tr key={s.idSuministro}>
                          <td><b>SUM-{String(s.idSuministro).padStart(3, '0')}</b></td>
                          <td>{s.codigoMedidor || 'Por Asignar'}</td>
                          <td>{s.tipoConexion}</td>
                          <td>🌿 {s.fuenteEnergia || 'Red Tradicional'}</td>
                          <td>
                            <span className={`badge ${s.estado === 'Activo' ? 'badge-activo' : 'badge-evaluacion'}`}>
                              ● {s.estado}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="panel-block">
              <h3>⏳ Historial de Consumos Guardados</h3>
              {loadingCons ? (
                <p style={{ color: 'var(--text-light)' }}>Cargando consumos...</p>
              ) : consError ? (
                <p style={{ color: '#c62828', background: '#ffebee', padding: 12, borderRadius: 12 }}>{consError}</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID Consumo</th>
                      <th>Fecha Registro</th>
                      <th>Horas/Días</th>
                      <th>Total Consumido</th>
                      <th>Costo Calculado</th>
                      <th>Huella CO2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumos.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-light)', padding: 20 }}>
                          No hay registros de consumo guardados en la sesión actual.
                        </td>
                      </tr>
                    ) : (
                      consumos.map((c) => (
                        <tr key={c.idConsumo}>
                          <td><b>CON-{c.idConsumo}</b></td>
                          <td>{c.fecha || 'Reciente'}</td>
                          <td>{c.horasUso} hrs / {c.dias} días</td>
                          <td><span style={{ color: 'var(--jade-medium)', fontWeight: 700 }}>{c.totalKwh.toFixed(2)} kWh</span></td>
                          <td>S/. {c.costoTotal.toFixed(2)}</td>
                          <td>{c.huellaCarbono.toFixed(2)} kg</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      <div id="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>
    </div>
  )
}
