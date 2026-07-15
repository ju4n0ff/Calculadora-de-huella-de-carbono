import { useState } from 'react'
import PropTypes from 'prop-types'
import { suministroApi } from '../../api'
import PanelBlock from '../ui/PanelBlock'

export default function SolicitarSuministro({ clienteId, onSuministroCreado, addToast }) {
  const [form, setForm] = useState({
    codigoMedidor: '',
    tipoConexion: 'monofasica',
    fuenteEnergia: 'red-publica',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.codigoMedidor) return
    setSaving(true)
    try {
      const payload = {
        codigoMedidor: form.codigoMedidor,
        tipoConexion: form.tipoConexion,
        fuenteEnergia: form.fuenteEnergia,
        estado: 'pendiente',
        cliente: { idCliente: clienteId },
      }
      await suministroApi.crear(payload)
      addToast('Solicitud de suministro enviada. Espera la aprobación del administrador.')
      setForm({ codigoMedidor: '', tipoConexion: 'monofasica', fuenteEnergia: 'red-publica' })
      if (onSuministroCreado) onSuministroCreado()
    } catch (err) {
      addToast('Error al solicitar suministro: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PanelBlock title="🔌 Solicitar Nuevo Suministro">
      <p style={{ color: 'var(--text-light)', marginBottom: 16, fontSize: '0.9rem' }}>
        Completa el formulario para solicitar un nuevo suministro eléctrico. Un administrador revisará y aprobará tu solicitud.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código del Medidor</label>
          <input
            className="form-control"
            value={form.codigoMedidor}
            onChange={(e) => setForm({ ...form, codigoMedidor: e.target.value })}
            placeholder="Ej: MED-001234"
            required
          />
        </div>
        <div className="form-group">
          <label>Tipo de Conexión</label>
          <select className="form-control" value={form.tipoConexion} onChange={(e) => setForm({ ...form, tipoConexion: e.target.value })}>
            <option value="monofasica">Monofásica</option>
            <option value="trifasica">Trifásica</option>
            <option value="bifasica">Bifásica</option>
          </select>
        </div>
        <div className="form-group">
          <label>Fuente de Energía</label>
          <select className="form-control" value={form.fuenteEnergia} onChange={(e) => setForm({ ...form, fuenteEnergia: e.target.value })}>
            <option value="red-publica">Red Pública</option>
            <option value="solar">Solar</option>
            <option value="eolica">Eólica</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={saving || !form.codigoMedidor}
          style={{ marginTop: 8 }}
        >
          {saving ? 'Enviando...' : 'Solicitar Suministro'}
        </button>
      </form>
    </PanelBlock>
  )
}

SolicitarSuministro.propTypes = {
  clienteId: PropTypes.number.isRequired,
  onSuministroCreado: PropTypes.func,
  addToast: PropTypes.func.isRequired,
}
