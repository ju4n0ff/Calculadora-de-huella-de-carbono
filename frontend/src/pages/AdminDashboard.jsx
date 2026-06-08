import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { clienteApi, consumoApi, simulacionApi } from '../api'
import AppLayout from '../components/layout/AppLayout'
import OverviewPanel from '../components/admin/OverviewPanel'
import ClientList from '../components/admin/ClientList'
import CO2Report from '../components/admin/CO2Report'
import CrudClientes from '../components/admin/CrudClientes'
import GestionSuministros from '../components/admin/GestionSuministros'
import GestionTarifas from '../components/admin/GestionTarifas'
import GestionReclamos from '../components/admin/GestionReclamos'
import DataTable from '../components/ui/DataTable'
import PanelBlock from '../components/ui/PanelBlock'
import Spinner from '../components/ui/Spinner'
import ErrorBanner from '../components/ui/ErrorBanner'
import ToastContainer from '../components/ui/Toast'

const panels = [
  { id: 'dashboard', label: 'Consumo General', icon: '📊' },
  { id: 'clientes', label: 'Clientes y Suministros', icon: '👥' },
  { id: 'reportes', label: 'Reporte Huella CO2', icon: '🌿' },
  { id: 'crud-clientes', label: 'CRUD Clientes', icon: '👤' },
  { id: 'gestionar-suministros', label: 'Aprobar Suministros', icon: '🔌' },
  { id: 'gestionar-tarifas', label: 'Gestionar Tarifas', icon: '💰' },
  { id: 'gestionar-reclamos', label: 'Responder Reclamos', icon: '📋' },
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

  const getClienteName = (idCliente) => {
    const c = clientes.find((cl) => cl.idCliente === idCliente)
    return c ? c.nombre : `Cliente ID: ${idCliente}`
  }

  const adminName = user?.datos?.nombre || user?.datos?.usuario || 'Admin'

  const consumosRows = consumos.slice(0, 10).map((c) => ({
    key: c.idConsumo,
    cells: [
      <b key="id">CON-{c.idConsumo}</b>,
      getClienteName(c.cliente?.idCliente),
      <span key="kwh" style={{ color: 'var(--ld-blue)', fontWeight: 700 }}>{c.totalKwh.toFixed(2)} kWh</span>,
      `S/. ${c.costoTotal.toFixed(2)}`,
      `${c.huellaCarbono.toFixed(2)} kg`,
      c.fecha || '—',
    ],
  }))

  return (
    <>
      <AppLayout
        panels={panels}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        title={panels.find((p) => p.id === activePanel)?.label}
        userName={`Admin: ${adminName}`}
        avatarIcon="💻"
        brandText="PowerCalc Admin"
        brandSub="Panel de Control"
      >
        <ErrorBanner message={error} onRetry={() => loadData(true)} />

        {loading && activePanel === 'dashboard' ? (
          <Spinner text="Cargando datos del servidor..." />
        ) : (
          <>
            {activePanel === 'dashboard' && (
              <div className="active-panel">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <button
                    className="btn-flat-info"
                    onClick={() => loadData(true)}
                    disabled={refreshing}
                    style={{ width: 'auto', padding: '8px 20px', borderStyle: 'solid' }}
                  >
                    {refreshing ? '↻ Actualizando...' : '↻ Actualizar Datos'}
                  </button>
                </div>
                <OverviewPanel
                  simulaciones={simulaciones}
                  consumos={consumos}
                  clientes={clientes}
                  loading={loading || refreshing}
                />
                <div className="panel-layout full-width" style={{ marginTop: 24 }}>
                  <PanelBlock title="📋 Últimos Consumos Registrados">
                    <DataTable
                      headers={['ID', 'Cliente', 'kWh', 'Costo', 'CO2', 'Fecha']}
                      rows={consumosRows}
                      emptyMessage="No hay consumos registrados."
                    />
                  </PanelBlock>
                </div>
              </div>
            )}
            {activePanel === 'clientes' && (
              <div className="active-panel">
                <ClientList clientes={clientes} consumos={consumos} />
              </div>
            )}
            {activePanel === 'reportes' && (
              <div className="active-panel">
                <CO2Report consumos={consumos} simulaciones={simulaciones} getClienteName={getClienteName} />
              </div>
            )}
            {activePanel === 'crud-clientes' && (
              <div className="active-panel">
                <CrudClientes addToast={addToast} />
              </div>
            )}
            {activePanel === 'gestionar-suministros' && (
              <div className="active-panel">
                <GestionSuministros addToast={addToast} />
              </div>
            )}
            {activePanel === 'gestionar-tarifas' && (
              <div className="active-panel">
                <GestionTarifas addToast={addToast} />
              </div>
            )}
            {activePanel === 'gestionar-reclamos' && (
              <div className="active-panel">
                <GestionReclamos addToast={addToast} adminId={user?.datos?.idAdministrador} />
              </div>
            )}
          </>
        )}
      </AppLayout>
      <ToastContainer toasts={toasts} />
    </>
  )
}
