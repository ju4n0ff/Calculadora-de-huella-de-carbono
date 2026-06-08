import { useState, useEffect, useRef, useCallback } from 'react'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import { useAuth } from '../contexts/AuthContext'
import { clienteApi, consumoApi, simulacionApi } from '../api'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Tooltip, Legend)

const panels = [
  { id: 'dashboard', label: '📊 Consumo General' },
  { id: 'clientes', label: '👥 Clientes y Suministros' },
  { id: 'reportes', label: '🌿 Reporte Huella CO2' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activePanel, setActivePanel] = useState('dashboard')
  const [clientes, setClientes] = useState([])
  const [consumos, setConsumos] = useState([])
  const [simulaciones, setSimulaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [toasts, setToasts] = useState([])

  const chartBarRef = useRef(null)
  const chartPieRef = useRef(null)
  const chartBarInst = useRef(null)
  const chartPieInst = useRef(null)

  const addToast = useCallback((msg) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')

    try {
      const [c, con, sim] = await Promise.all([
        clienteApi.listar(),
        consumoApi.listar().catch(() => []),
        simulacionApi.listar().catch(() => []),
      ])
      setClientes(c)
      setConsumos(con)
      setSimulaciones(sim)
      if (showRefresh) addToast('Datos actualizados correctamente.')
    } catch (err) {
      setError('Error al cargar datos del servidor. Verifica que el backend esté corriendo.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [addToast])

  useEffect(() => {
    if (activePanel === 'dashboard') {
      loadData()
    }
  }, [activePanel, loadData])

  useEffect(() => {
    if (activePanel !== 'dashboard' || loading || refreshing || !chartBarRef.current) return

    if (chartBarInst.current) chartBarInst.current.destroy()
    if (chartPieInst.current) chartPieInst.current.destroy()

    const source = simulaciones.length > 0 ? simulaciones : consumos

    if (source.length > 0) {
      const labels = source.map((c) => `REG-${c.id || c.idConsumo}`)
      const values = source.map((c) => c.energiaKwh ?? c.totalKwh ?? 0)

      chartBarInst.current = new Chart(chartBarRef.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Consumo (kWh)', data: values, backgroundColor: '#26a69a', borderRadius: 6 }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      })

      let bajo = 0, medio = 0, alto = 0
      values.forEach((v) => {
        if (v < 150) bajo++
        else if (v <= 300) medio++
        else alto++
      })

      chartPieInst.current = new Chart(chartPieRef.current.getContext('2d'), {
        type: 'pie',
        data: {
          labels: ['Bajo 🟢', 'Moderado 🟡', 'Alto Riesgo 🔴'],
          datasets: [{ data: [bajo, medio, alto], backgroundColor: ['#00796b', '#ffb300', '#991b1b'] }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      })
    }

    return () => {
      if (chartBarInst.current) chartBarInst.current.destroy()
      if (chartPieInst.current) chartPieInst.current.destroy()
    }
  }, [activePanel, loading, refreshing, simulaciones, consumos])

  const totalKwh = [...simulaciones, ...consumos].reduce(
    (s, c) => s + (c.energiaKwh ?? c.totalKwh ?? 0), 0
  )
  const totalSoles = [...simulaciones, ...consumos].reduce(
    (s, c) => s + (c.costoSoles ?? c.costoTotal ?? 0), 0
  )

  const adminName = user?.datos?.nombre || user?.datos?.usuario || 'Admin'

  const getClienteName = (idCliente) => {
    const c = clientes.find((cl) => cl.idCliente === idCliente)
    return c ? c.nombre : `Cliente ID: ${idCliente}`
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand"><span>🌱</span> EcoGlow Admin</div>
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
            <span>Admin: {adminName}</span>
            <div className="user-avatar">💻</div>
          </div>
        </header>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: 14, borderRadius: 12, marginBottom: 20, border: '1px solid #ffcdd2', fontWeight: 600 }}>
            ⚠️ {error}
            <button onClick={() => loadData(true)} style={{ marginLeft: 16, padding: '4px 12px', border: '1px solid #c62828', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>
              Reintentar
            </button>
          </div>
        )}

        {loading && activePanel === 'dashboard' ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-light)', marginTop: 16 }}>Cargando datos del servidor...</p>
          </div>
        ) : (
          <>
            {activePanel === 'dashboard' && (
              <div className="active-panel">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <button className="btn-flat-info" onClick={() => loadData(true)} disabled={refreshing} style={{ width: 'auto', padding: '8px 20px' }}>
                    {refreshing ? '↻ Actualizando...' : '↻ Actualizar Datos'}
                  </button>
                </div>

                <div className="overview-grid">
                  <div className="metric-card">
                    <div className="metric-title">Energía Monitoreada Total</div>
                    <div className="metric-value">{totalKwh.toFixed(1)} kWh</div>
                    <div className="metric-footer">📊 De todas las simulaciones y consumos</div>
                  </div>
                  <div className="metric-card alert">
                    <div className="metric-title">Recaudación por Consumos</div>
                    <div className="metric-value">S/. {totalSoles.toFixed(2)}</div>
                    <div className="metric-footer">💰 Basado en tarifa BT5B</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-title">Clientes Activos</div>
                    <div className="metric-value">{clientes.length}</div>
                    <div className="metric-footer">👥 Registrados en el sistema</div>
                  </div>
                </div>

                <div className="panel-layout">
                  <div className="panel-block">
                    <h3>📈 Distribución de Energía por Registros (kWh)</h3>
                    <div className="chart-container"><canvas ref={chartBarRef}></canvas></div>
                  </div>
                  <div className="panel-block">
                    <h3>⚖️ Impacto de Carbono por Categoría</h3>
                    <div className="chart-container"><canvas ref={chartPieRef}></canvas></div>
                  </div>
                </div>

                <div className="panel-layout full-width" style={{ marginTop: 30 }}>
                  <div className="panel-block">
                    <h3>📋 Últimos Consumos Registrados</h3>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>kWh</th>
                          <th>Costo</th>
                          <th>CO2</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumos.length === 0 ? (
                          <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-light)', padding: 20 }}>No hay consumos registrados.</td></tr>
                        ) : (
                          consumos.slice(0, 10).map((c) => (
                            <tr key={c.idConsumo}>
                              <td><b>CON-{c.idConsumo}</b></td>
                              <td>{getClienteName(c.cliente?.idCliente)}</td>
                              <td><span style={{ color: 'var(--jade-medium)', fontWeight: 700 }}>{c.totalKwh.toFixed(2)} kWh</span></td>
                              <td>S/. {c.costoTotal.toFixed(2)}</td>
                              <td>{c.huellaCarbono.toFixed(2)} kg</td>
                              <td>{c.fecha || '—'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'clientes' && (
              <div className="active-panel">
                <div className="panel-layout full-width">
                  <div className="panel-block">
                    <h3>👥 Directorio de Clientes y Consumos Vinculados</h3>
                    {clientes.length === 0 ? (
                      <p style={{ color: 'var(--text-light)' }}>No hay clientes registrados.</p>
                    ) : (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID Cliente</th>
                            <th>Nombre Completo</th>
                            <th>Dirección</th>
                            <th>ID Tarifa</th>
                            <th>Total Consumido</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientes.map((c) => {
                            const consumosCliente = consumos.filter((con) => con.cliente?.idCliente === c.idCliente)
                            const totalCliente = consumosCliente.reduce((s, con) => s + (con.totalKwh || 0), 0)
                            return (
                              <tr key={c.idCliente}>
                                <td><b>CLI-{c.idCliente}</b></td>
                                <td>{c.nombre}</td>
                                <td>{c.direccion || 'No registrada'}</td>
                                <td><span style={{ color: 'var(--jade-medium)', fontWeight: 700 }}>Tarifa {c.idTarifa}</span></td>
                                <td>
                                  <span style={{ fontWeight: 700, color: totalCliente > 300 ? '#991b1b' : totalCliente > 150 ? '#92400e' : '#065f46' }}>
                                    {totalCliente.toFixed(2)} kWh
                                  </span>
                                  <small style={{ color: 'var(--text-light)', marginLeft: 6 }}>({consumosCliente.length} registros)</small>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'reportes' && (
              <div className="active-panel">
                <div className="panel-layout full-width">
                  <div className="panel-block">
                    <h3>🌿 Semáforo de Control Ambiental e Indicadores de Carbono</h3>
                    {consumos.length === 0 && simulaciones.length === 0 ? (
                      <p style={{ color: 'var(--text-light)' }}>No hay registros de consumo para mostrar.</p>
                    ) : (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID Registro</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total (kWh)</th>
                            <th>Huella Carbono</th>
                            <th>Semáforo Ecológico</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consumos.map((c) => {
                            let badge
                            if (c.totalKwh < 150) badge = <span className="badge badge-bajo">🟢 Bajo Consumo</span>
                            else if (c.totalKwh <= 300) badge = <span className="badge badge-medio">🟡 Moderado</span>
                            else badge = <span className="badge badge-alto">🔴 Alto Riesgo</span>

                            return (
                              <tr key={`con-${c.idConsumo}`}>
                                <td><b>CON-{c.idConsumo}</b></td>
                                <td>{c.fecha || 'Reciente'}</td>
                                <td>{getClienteName(c.cliente?.idCliente)}</td>
                                <td>{c.totalKwh.toFixed(2)} kWh</td>
                                <td><b>{c.huellaCarbono.toFixed(2)} kg CO2</b></td>
                                <td>{badge}</td>
                              </tr>
                            )
                          })}
                          {simulaciones.map((s) => {
                            let badge
                            if (s.energiaKwh < 150) badge = <span className="badge badge-bajo">🟢 Bajo Consumo</span>
                            else if (s.energiaKwh <= 300) badge = <span className="badge badge-medio">🟡 Moderado</span>
                            else badge = <span className="badge badge-alto">🔴 Alto Riesgo</span>

                            return (
                              <tr key={`sim-${s.id}`}>
                                <td><b>SIM-{s.id}</b></td>
                                <td>{s.fechaRegistro ? new Date(s.fechaRegistro).toLocaleDateString() : 'Reciente'}</td>
                                <td>{s.usuario?.nombre || `Usuario ID: ${s.usuario?.id}`}</td>
                                <td>{s.energiaKwh?.toFixed(2)} kWh</td>
                                <td><b>{s.co2Kg?.toFixed(2)} kg CO2</b></td>
                                <td>{badge}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
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
