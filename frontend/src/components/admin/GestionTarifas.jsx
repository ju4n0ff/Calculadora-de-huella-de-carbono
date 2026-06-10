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
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyTarifa)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [creating, setCreating] = useState(false)

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

  const startEdit = (tarifa) => {
    setEditingId(tarifa.idTarifa)
    setForm({
      nombre: tarifa.nombre || '',
      precioKwh: tarifa.precioKwh ?? '',
      descripcion: tarifa.descripcion || '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyTarifa)
  }

  const openCreate = () => {
    setCreating(true)
    setForm(emptyTarifa)
  }

  const handleSave = async (id) => {
    if (!form.nombre || form.precioKwh === '') return
    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre,
        precioKwh: Number(form.precioKwh),
        descripcion: form.descripcion,
      }
      if (creating) {
        await tarifaApi.crear(payload)
        addToast('Tarifa creada correctamente.')
      } else {
        await tarifaApi.actualizar(id, payload)
        addToast('Tarifa actualizada correctamente.')
      }
      setCreating(false)
      cancelEdit()
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

  const rows = tarifas.map((t) => {
    const isEditing = editingId === t.idTarifa
    return {
      key: t.idTarifa,
      cells: [
        isEditing ? t.idTarifa : t.idTarifa,
        isEditing ? (
          <input
            className="inline-input"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            autoFocus
          />
        ) : t.nombre,
        isEditing ? (
          <input
            className="inline-input"
            type="number"
            step="0.01"
            min="0"
            value={form.precioKwh}
            onChange={(e) => setForm({ ...form, precioKwh: e.target.value })}
          />
        ) : (
          <span style={{ color: 'var(--ld-blue)', fontWeight: 700 }}>S/. {t.precioKwh}</span>
        ),
        isEditing ? (
          <textarea
            className="inline-input"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            rows={1}
            style={{ resize: 'vertical' }}
          />
        ) : (t.descripcion || '—'),
        <div key="acc" className="action-btns">
          {isEditing ? (
            <>
              <button className="btn btn-success btn-xs" onClick={() => handleSave(t.idTarifa)} disabled={saving}>
                {saving ? '...' : 'Guardar'}
              </button>
              <button className="btn btn-ghost btn-xs" onClick={cancelEdit} disabled={saving}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-xs" onClick={() => startEdit(t)}>
                Editar
              </button>
              <button className="btn btn-ghost-danger btn-xs" onClick={() => setDeleteTarget(t)}>
                Eliminar
              </button>
            </>
          )}
        </div>,
      ],
    }
  })

  return (
    <>
      <PanelBlock title="💰 Gestión de Tarifas">
        <div className="header-actions">
          <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>
            {tarifas.length} tarifa{tarifas.length !== 1 ? 's' : ''} registrada{tarifas.length !== 1 ? 's' : ''}
          </span>
          <button className="btn btn-primary btn-md" onClick={openCreate}>
            + Nueva Tarifa
          </button>
        </div>
        <ErrorBanner message={error} onRetry={load} />
        {loading ? (
          <Spinner text="Cargando tarifas..." />
        ) : (
          <DataTable
            headers={['ID', 'Nombre', 'Precio', 'Descripción', 'Acciones']}
            rows={rows}
            emptyMessage="No hay tarifas registradas."
          />
        )}
      </PanelBlock>

      {creating && (
        <div className="modal-overlay" onClick={() => !saving && setCreating(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Nueva Tarifa</h3>
            <div className="form-group">
              <label>Nombre</label>
              <input className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} autoFocus />
            </div>
            <div className="form-group">
              <label>Precio por kWh (S/.)</label>
              <input className="form-control" type="number" step="0.01" min="0" value={form.precioKwh} onChange={(e) => setForm({ ...form, precioKwh: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea className="form-control" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost btn-md" onClick={() => setCreating(false)} disabled={saving}>
                Cancelar
              </button>
              <button className="btn btn-primary btn-md" onClick={() => handleSave(null)} disabled={saving || !form.nombre || form.precioKwh === ''}>
                {saving ? 'Guardando...' : 'Crear Tarifa'}
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
