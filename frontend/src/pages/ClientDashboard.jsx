import { useState, useEffect, useRef, useCallback } from 'react'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { useAuth } from '../contexts/AuthContext'
import { suministroApi, consumoApi } from '../api'
import AppLayout from '../components/layout/AppLayout'
import CalculatorPage from '../components/calculator/CalculatorPage'
import MetricCard from '../components/ui/MetricCard'
import PanelBlock from '../components/ui/PanelBlock'
import SupplyList from '../components/client/SupplyList'
import ConsumptionHistory from '../components/client/ConsumptionHistory'
import SolicitarSuministro from '../components/client/SolicitarSuministro'
import VerBoleta from '../components/client/VerBoleta'
import MisReclamos from '../components/client/MisReclamos'
import ToastContainer from '../components/ui/Toast'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const panels = [
  { id: 'dashboard', label: 'Mi Dashboard', icon: '📊' },
  { id: 'simulador', label: 'Simulador de Carga', icon: '⚡' },
  { id: 'suministros', label: 'Mis Suministros', icon: '🔌' },
  { id: 'solicitar', label: 'Solicitar Suministro', icon: '➕' },
  { id: 'boleta', label: 'Ver Boleta', icon: '📄' },
  { id: 'reclamos', label: 'Reclamos', icon: '📝' },
]

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const [activePanel, setActivePanel] = useState('dashboard')
  const [store, setStore] = useState({ totalKwh: 0, costoSoles: 0, co2Kg: 0 })
  const [suministros, setSuministros] = useState([])
  const [consumos, setConsumos] = useState([])
  const [loadingSum, setLoadingSum] = useState(false)
  const [loadingCons, setLoadingCons] = useState(false)
  const [sumError, setSumError] = useState('')
  const [consError, setConsError] = useState('')
  const [saving, setSaving] = useState(false)
  const [suministroId, setSuministroId] = useState('')
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

  const loadSuministros = useCallback(() => {
    setLoadingSum(true)
    setSumError('')
    suministroApi.listarPorCliente(clienteId)
      .then((data) => {
        setSuministros(data)
        if (data.length > 0 && !suministroId) {
          setSuministroId(String(data[0].idSuministro))
        }
      })
      .catch(() => setSumError('No se pudieron cargar los suministros. Verifica la conexión con el servidor.'))
      .finally(() => setLoadingSum(false))
  }, [clienteId, suministroId])

  const loadConsumos = useCallback(() => {
    setLoadingCons(true)
    setConsError('')
    consumoApi.listarPorCliente(clienteId)
      .then(setConsumos)
      .catch(() => setConsError('No se pudieron cargar los consumos.'))
      .finally(() => setLoadingCons(false))
  }, [clienteId])

  useEffect(() => {
    if (activePanel === 'suministros' || activePanel === 'simulador' || activePanel === 'solicitar') {
      if (suministros.length === 0) loadSuministros()
      if (activePanel === 'suministros') loadConsumos()
    }
  }, [activePanel, loadSuministros, loadConsumos, suministros.length])

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
            backgroundColor: ['#263184', '#FAE870'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } },
          },
        },
      })
      return () => { if (chartInstance.current) chartInstance.current.destroy() }
    }
  }, [activePanel, store])

  const guardarConsumo = async ({ totalKwh, costoSoles, co2Kg, horas, dias }) => {
    if (!suministroId) return
    setSaving(true)
    try {
      const payload = {
        cliente: { idCliente: clienteId },
        suministro: { idSuministro: parseInt(suministroId) },
        horasUso: horas,
        dias,
        totalKwh,
        costoTotal: costoSoles,
        huellaCarbono: co2Kg,
        fecha: new Date().toISOString().split('T')[0],
      }
      await consumoApi.guardar(payload)
      addToast('¡Consumo guardado exitosamente en la base de datos!')
      setStore({ totalKwh, costoSoles, co2Kg })
      const updated = await consumoApi.listarPorCliente(clienteId)
      setConsumos(updated)
    } catch (err) {
      addToast('Error al guardar el consumo: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <AppLayout
        panels={panels}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        title={panels.find((p) => p.id === activePanel)?.label}
        userName={`Hola, ${clienteNombre}`}
        avatarIcon="⚡"
        brandText="PowerCalc"
        brandSub="Cliente"
      >
        {activePanel === 'dashboard' && (
          <div className="active-panel">
            <div className="overview-grid">
              <MetricCard
                icon="⚡"
                title="Último Consumo Calculado"
                value={`${store.totalKwh.toFixed(2)} kWh`}
                footer="Registrado en la base de datos"
              />
              <MetricCard
                icon="💰"
                title="Costo Económico Acumulado"
                value={`S/. ${store.costoSoles.toFixed(2)}`}
                footer="Basado en tarifa asignada"
                alert
              />
              <MetricCard
                icon="🌿"
                title="Huella Ecológica Generada"
                value={`${store.co2Kg.toFixed(2)} kg CO2`}
                footer="Indicador ambiental total"
              />
            </div>
            <div className="panel-layout full-width">
              <PanelBlock title="📈 Historial de Consumo Energético">
                <div className="chart-container">
                  <canvas ref={chartRef}></canvas>
                </div>
              </PanelBlock>
            </div>
          </div>
        )}

        {activePanel === 'simulador' && (
          <div className="active-panel">
            <CalculatorPage
              suministros={suministros}
              suministroId={suministroId}
              onSuministroChange={setSuministroId}
              onGuardar={guardarConsumo}
              saving={saving}
              loadingSum={loadingSum}
            />
          </div>
        )}

        {activePanel === 'suministros' && (
          <div className="active-panel">
            <SupplyList suministros={suministros} loading={loadingSum} error={sumError} />
            <ConsumptionHistory consumos={consumos} loading={loadingCons} error={consError} />
          </div>
        )}

        {activePanel === 'solicitar' && (
          <div className="active-panel">
            <SolicitarSuministro
              clienteId={clienteId}
              onSuministroCreado={loadSuministros}
              addToast={addToast}
            />
          </div>
        )}

        {activePanel === 'boleta' && (
          <div className="active-panel">
            <VerBoleta clienteId={clienteId} />
          </div>
        )}

        {activePanel === 'reclamos' && (
          <div className="active-panel">
            <MisReclamos clienteId={clienteId} addToast={addToast} />
          </div>
        )}
      </AppLayout>
      <ToastContainer toasts={toasts} />
    </>
  )
}
