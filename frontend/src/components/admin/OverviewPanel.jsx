import { useEffect, useRef } from 'react'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import PropTypes from 'prop-types'
import MetricCard from '../ui/MetricCard'
import PanelBlock from '../ui/PanelBlock'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Tooltip, Legend)

export default function OverviewPanel({ simulaciones, consumos, clientes, loading }) {
  const chartBarRef = useRef(null)
  const chartPieRef = useRef(null)
  const chartBarInst = useRef(null)
  const chartPieInst = useRef(null)

  const totalKwh = [...simulaciones, ...consumos].reduce(
    (s, c) => s + (c.energiaKwh ?? c.totalKwh ?? 0), 0
  )
  const totalSoles = [...simulaciones, ...consumos].reduce(
    (s, c) => s + (c.costoSoles ?? c.costoTotal ?? 0), 0
  )

  useEffect(() => {
    if (loading || !chartBarRef.current) return

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
          datasets: [{
            label: 'Consumo (kWh)',
            data: values,
            backgroundColor: '#263184',
            borderRadius: 6,
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
          datasets: [{
            data: [bajo, medio, alto],
            backgroundColor: ['#263184', '#FAE870', '#dc2626'],
          }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      })
    }

    return () => {
      if (chartBarInst.current) chartBarInst.current.destroy()
      if (chartPieInst.current) chartPieInst.current.destroy()
    }
  }, [loading, simulaciones, consumos])

  return (
    <>
      <div className="overview-grid">
        <MetricCard
          icon="⚡"
          title="Energía Monitoreada Total"
          value={`${totalKwh.toFixed(1)} kWh`}
          footer="De todas las simulaciones y consumos"
        />
        <MetricCard
          icon="💰"
          title="Recaudación por Consumos"
          value={`S/. ${totalSoles.toFixed(2)}`}
          footer="Basado en tarifa BT5B"
          alert
        />
        <MetricCard
          icon="👥"
          title="Clientes Activos"
          value={clientes.length}
          footer="Registrados en el sistema"
        />
      </div>

      <div className="panel-layout">
        <PanelBlock title="📈 Distribución de Energía por Registros (kWh)">
          <div className="chart-container"><canvas ref={chartBarRef}></canvas></div>
        </PanelBlock>
        <PanelBlock title="⚖️ Impacto de Carbono por Categoría">
          <div className="chart-container"><canvas ref={chartPieRef}></canvas></div>
        </PanelBlock>
      </div>
    </>
  )
}

OverviewPanel.propTypes = {
  simulaciones: PropTypes.array.isRequired,
  consumos: PropTypes.array.isRequired,
  clientes: PropTypes.array.isRequired,
  loading: PropTypes.bool,
}
