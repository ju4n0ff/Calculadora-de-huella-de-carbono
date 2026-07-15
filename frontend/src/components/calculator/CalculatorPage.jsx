import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ApplianceGrid from './ApplianceGrid'
import ConfigPanel from './ConfigPanel'
import ResultsPanel from './ResultsPanel'
import TerminalOutput from './TerminalOutput'
import SupplySelector from './SupplySelector'
import PanelBlock from '../ui/PanelBlock'
import ConfirmModal from '../ui/ConfirmModal'
import { artefactoApi } from '../../api'

const FALLBACK_ARTEFACTOS = [
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

const ICONOS = {
  'Foco LED': '💡', 'Televisor': '📺', 'Refrigeradora': '❄️', 'Laptop': '💻',
  'Microondas': '🍿', 'Lavadora': '🧺', 'Plancha': '👔', 'Secadora': '💨',
  'Ducha eléctrica': '🚿', 'Ventilador': '🌀', 'Aire acondicionado': '🥶',
  'Horno eléctrico': '🥧', 'Cafetera': '☕', 'Licuadora': '🥤', 'Router': '🌐',
  'Consola': '🎮', 'Aspiradora': '🧹', 'Bomba de agua': '🚰',
  'Cargador celular': '🔌', 'PC de escritorio': '🖥️',
}

function mapArtefacto(a) {
  return { id: a.id, nombre: a.nombre, watts: a.wattsBase, icon: ICONOS[a.nombre] || '🔌' }
}

const FACTOR_CO2 = 0.21

const METODOLOGIA_TEXT =
  '======================================================================\n' +
  '               MÉTODO DE ANÁLISIS DE ENERGÍA Y CO2                   \n' +
  '======================================================================\n\n' +
  '1. Consumo Mensual = (Potencia en Watts x Horas Uso x Días) / 1000\n' +
  '2. Importe Económico (S/.) = Consumo Mensual (kWh) x Tarifa\n' +
  '3. Huella Ecológica (kgCO2) = Consumo Mensual (kWh) x 0.21'

export default function CalculatorPage({ suministros, onGuardar, saving, suministroId, onSuministroChange, loadingSum, precioKwh = 0.68, nombreTarifa = 'BT5B' }) {
  const [artefactos, setArtefactos] = useState(FALLBACK_ARTEFACTOS)
  const [selected, setSelected] = useState(new Set())
  const [horas, setHoras] = useState(4)
  const [dias, setDias] = useState(30)
  const [terminal, setTerminal] = useState('--- Sistema listo. Selecciona componentes y presiona "Ejecutar Análisis Técnico" ---')
  const [analisisValido, setAnalisisValido] = useState(false)
  const [totalKwh, setTotalKwh] = useState(0)
  const [costoSoles, setCostoSoles] = useState(0)
  const [co2Kg, setCo2Kg] = useState(0)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [pendingSave, setPendingSave] = useState(null)

  useEffect(() => {
    artefactoApi.listar()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArtefactos(data.map(mapArtefacto))
        }
      })
      .catch(() => { /* usar fallback */ })
  }, [])

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
    if (!horas || horas < 1 || horas > 24) {
      setTerminal('[ERROR] Las horas de uso deben estar entre 1 y 24 por día.')
      setAnalisisValido(false)
      return
    }
    if (!dias || dias < 1 || dias > 31) {
      setTerminal('[ERROR] Los días de uso deben estar entre 1 y 31 por mes.')
      setAnalisisValido(false)
      return
    }
    const seleccionados = artefactos.filter((a) => selected.has(a.id))
    const totalWatts = seleccionados.reduce((sum, a) => sum + a.watts, 0)
    const kwh = (totalWatts * horas * dias) / 1000
    const soles = kwh * precioKwh
    const co2 = kwh * FACTOR_CO2

    setTotalKwh(kwh)
    setCostoSoles(soles)
    setCo2Kg(co2)
    setAnalisisValido(true)

    const listaNombres = seleccionados.map((a) => a.nombre)
    setTerminal(
      `======================================================================\n` +
      `       📊 REPORTE TÉCNICO DE CONSUMO - MACO DEL SISTEMA               \n` +
      `======================================================================\n` +
      `• Componentes Analizados: ${listaNombres.join(', ')}\n` +
      `• Potencia de Carga Agrupada: ${(totalWatts / 1000).toFixed(3)} kW\n` +
      `• Régimen Configurado: ${horas} horas/día por ${dias} días al mes\n` +
      `• Tarifa Aplicada: ${nombreTarifa} (S/. ${precioKwh}/kWh)\n` +
      `----------------------------------------------------------------------\n` +
      `⚡ ENERGÍA TOTAL MENSUAL:   ${kwh.toFixed(2)} kWh\n` +
      `💰 COSTO ESTIMADO (${nombreTarifa}):   S/. ${soles.toFixed(2)}\n` +
      `🌿 INFLUENCIA DE CARBONO:   ${co2.toFixed(2)} kg de CO2 emitidos\n` +
      `----------------------------------------------------------------------\n` +
      `✅ [ANÁLISIS COMPLETADO] Datos listos para persistencia en base de datos.`
    )
  }

  return (
    <div className="calculator-layout">
      <PanelBlock title="⚡ Modelador Técnico de Carga y Consumo">
        <ApplianceGrid artefactos={artefactos} selected={selected} onToggle={toggleAppliance} />
        <TerminalOutput text={terminal} />
      </PanelBlock>

      <div>
        <PanelBlock>
          <ConfigPanel
            horas={horas}
            dias={dias}
            onHorasChange={setHoras}
            onDiasChange={setDias}
            onMetodologia={() => setTerminal(METODOLOGIA_TEXT)}
          />
          <SupplySelector
            suministros={suministros}
            suministroId={suministroId}
            onChange={onSuministroChange}
            loading={loadingSum}
          />
          <button className="btn-action-primary" onClick={ejecutarAnalisis}>
            ⚙️ Ejecutar Análisis Técnico
          </button>
          <button
            className="btn-action-secondary"
            disabled={!analisisValido || !suministroId || saving}
            onClick={() => {
              const seleccionados = artefactos.filter((a) => selected.has(a.id))
              setPendingSave({ totalKwh, costoSoles, co2Kg, horas, dias, artefactos: seleccionados })
              setShowSaveModal(true)
            }}
          >
            {saving ? 'Guardando...' : '💾 Guardar consumo en Base de Datos'}
          </button>
        </PanelBlock>

        <ResultsPanel totalKwh={totalKwh} costoSoles={costoSoles} co2Kg={co2Kg} hasResults={analisisValido} />
      </div>

      <ConfirmModal
        open={showSaveModal}
        title="Guardar Consumo"
        message={`¿Confirmas que deseas guardar este consumo de ${pendingSave?.totalKwh?.toFixed(2) || 0} kWh en la base de datos?`}
        confirmLabel="Guardar"
        variant="primary"
        onConfirm={() => { setShowSaveModal(false); if (pendingSave) onGuardar(pendingSave) }}
        onCancel={() => { setShowSaveModal(false); setPendingSave(null) }}
      />
    </div>
  )
}

CalculatorPage.propTypes = {
  suministros: PropTypes.array.isRequired,
  onGuardar: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  suministroId: PropTypes.string.isRequired,
  onSuministroChange: PropTypes.func.isRequired,
  loadingSum: PropTypes.bool,
  precioKwh: PropTypes.number,
  nombreTarifa: PropTypes.string,
}
