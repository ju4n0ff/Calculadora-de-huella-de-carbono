import { useState } from 'react'
import PropTypes from 'prop-types'
import ApplianceGrid, { artefactos } from './ApplianceGrid'
import ConfigPanel from './ConfigPanel'
import ResultsPanel from './ResultsPanel'
import TerminalOutput from './TerminalOutput'
import SupplySelector from './SupplySelector'
import PanelBlock from '../ui/PanelBlock'
import ConfirmModal from '../ui/ConfirmModal'

const PRECIO_KWH = 0.68
const FACTOR_CO2 = 0.21

const METODOLOGIA_TEXT =
  '======================================================================\n' +
  '               MÉTODO DE ANÁLISIS DE ENERGÍA Y CO2                   \n' +
  '======================================================================\n\n' +
  '1. Consumo Mensual = (Potencia en Watts x Horas Uso x Días) / 1000\n' +
  '2. Importe Económico (S/.) = Consumo Mensual (kWh) x S/. 0.68\n' +
  '3. Huella Ecológica (kgCO2) = Consumo Mensual (kWh) x 0.21'

export default function CalculatorPage({ suministros, onGuardar, saving, suministroId, onSuministroChange, loadingSum }) {
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
    const soles = kwh * PRECIO_KWH
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
      `----------------------------------------------------------------------\n` +
      `⚡ ENERGÍA TOTAL MENSUAL:   ${kwh.toFixed(2)} kWh\n` +
      `💰 COSTO ESTIMADO (BT5B):   S/. ${soles.toFixed(2)}\n` +
      `🌿 INFLUENCIA DE CARBONO:   ${co2.toFixed(2)} kg de CO2 emitidos\n` +
      `----------------------------------------------------------------------\n` +
      `✅ [ANÁLISIS COMPLETADO] Datos listos para persistencia en base de datos.`
    )
  }

  return (
    <div className="calculator-layout">
      <PanelBlock title="⚡ Modelador Técnico de Carga y Consumo">
        <ApplianceGrid selected={selected} onToggle={toggleAppliance} />
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
              setPendingSave({ totalKwh, costoSoles, co2Kg, horas, dias })
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
}
