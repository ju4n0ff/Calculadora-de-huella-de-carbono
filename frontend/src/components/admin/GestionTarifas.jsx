import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { tarifaApi } from '../../api'
import DataTable from '../ui/DataTable'
import PanelBlock from '../ui/PanelBlock'
import ConfirmModal from '../ui/ConfirmModal'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

const emptyTarifa = { nombre: '', precioKwh: '', descripcion: '' }

export default function GestionTarifas({ addToast }) {
  const [tarifas, setTarifas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyTarifa)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await tarifaApi.listar()
      setTarifas(data)
    } catch {
      setError('Error al cargar tarifas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyTarifa)
    setShowForm(true)
  }

  const openEdit = (tarifa) => {
    setEditing(tarifa)
    setForm({
      nombre: tarifa.nombre || '',
      precioKwh: tarifa.precioKwh ?? '',
      descripcion: tarifa.descripcion || '',
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.nombre || form.precioKwh === '') return
    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre,
        precioKwh: Number(form.precioKwh),
        descripcion: form.descripcion,
      }
      if (editing) {
        await tarifaApi.actualizar(editing.idTarifa, payload)
        addToast('Tarifa actualizada correctamente.')
      } else {
        await tarifaApi.crear(payload)
        addToast('Tarifa creada correctamente.')
      }
      setShowForm(false)
      await load()
    } catch (err) {
      addToast('Error al guardar: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await tarifaApi.eliminar(deleteTarget.idTarifa)
      addToast('Tarifa eliminada correctamente.')
      setDeleteTarget(null)
      await load()
    } catch (err) {
      addToast('Error al eliminar: ' + (err.message || 'desconocido'))
    }
  }

  const rows = tarifas.map((t) => ({
    key: t.idTarifa,
    cells: [
      t.idTarifa,
      t.nombre,
      <span key="precio" style={{ color: 'var(--ld-blue)', fontWeight: 700 }}>S/. {t.precioKwh}</span>,
      <span key="precio-unit" style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>por kWh</span>,
      t.descripcion || '—',
      <div key="acciones" style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-flat-info"
          onClick={() => openEdit(t)}
          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
        >
          Editar
        </button>
        <button
          className="btn-flat-danger"
          onClick={() => setDeleteTarget(t)}
          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
        >
          Eliminar
        </button>
      </div>,
    ],
  }))

  return (
    <>
      <PanelBlock title="💰 Gestión de Tarifas">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn-primary" onClick={openCreate} style={{ width: 'auto', padding: '10px 24px' }}>
            + Nueva Tarifa
          </button>
        </div>
        <ErrorBanner message={error} onRetry={load} />
        {loading ? (
          <Spinner text="Cargando tarifas..." />
        ) : (
          <DataTable
            headers={['ID', 'Nombre', 'Precio', '', 'Descripción', 'Acciones']}
            rows={rows}
            emptyMessage="No hay tarifas registradas."
          />
        )}
      </PanelBlock>

      {showForm && (
        <div className="modal-overlay" onClick={() => !saving && setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--ld-blue)', marginBottom: 20 }}>
              {editing ? 'Editar Tarifa' : 'Nueva Tarifa'}
            </h3>
            <div className="form-group">
              <label>Nombre</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Precio por kWh (S/.)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.precioKwh}
                onChange={(e) => setForm({ ...form, precioKwh: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving || !form.nombre || form.precioKwh === ''}
              >
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar Tarifa"
        message={`¿Estás seguro de eliminar la tarifa "${deleteTarget?.nombre}"?`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

GestionTarifas.propTypes = {
  addToast: PropTypes.func.isRequired,
}
