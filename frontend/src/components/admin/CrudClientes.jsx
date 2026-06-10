import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { clienteApi, tarifaApi } from '../../api'
import DataTable from '../ui/DataTable'
import PanelBlock from '../ui/PanelBlock'
import ConfirmModal from '../ui/ConfirmModal'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

const emptyCliente = { nombre: '', dni: '', direccion: '', idTarifa: '' }

export default function CrudClientes({ addToast }) {
  const [clientes, setClientes] = useState([])
  const [tarifas, setTarifas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyCliente)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [c, t] = await Promise.all([
        clienteApi.listar(),
        tarifaApi.listar().catch(() => []),
      ])
      setClientes(c)
      setTarifas(t)
    } catch {
      setError('Error al cargar datos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const startEdit = (cliente) => {
    setEditingId(cliente.idCliente)
    setForm({
      nombre: cliente.nombre || '',
      dni: cliente.dni || '',
      direccion: cliente.direccion || '',
      idTarifa: cliente.idTarifa ?? '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyCliente)
  }

  const openCreate = () => {
    setCreating(true)
    setForm(emptyCliente)
  }

  const handleSaveInline = async (id) => {
    if (!form.nombre || !form.dni) return
    setSaving(true)
    try {
      await clienteApi.actualizar(id, {
        nombre: form.nombre,
        dni: form.dni,
        direccion: form.direccion,
        idTarifa: form.idTarifa ? Number(form.idTarifa) : null,
      })
      addToast('Cliente actualizado correctamente.')
      cancelEdit()
      await load()
    } catch (err) {
      addToast('Error al guardar: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async () => {
    if (!form.nombre || !form.dni) return
    setSaving(true)
    try {
      await clienteApi.crear({
        nombre: form.nombre,
        dni: form.dni,
        direccion: form.direccion,
        idTarifa: form.idTarifa ? Number(form.idTarifa) : null,
      })
      addToast('Cliente creado correctamente.')
      setCreating(false)
      await load()
    } catch (err) {
      addToast('Error al crear: ' + (err.message || 'desconocido'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await clienteApi.eliminar(deleteTarget.idCliente)
      addToast('Cliente eliminado correctamente.')
      setDeleteTarget(null)
      await load()
    } catch (err) {
      addToast('Error al eliminar: ' + (err.message || 'desconocido'))
    }
  }

  const rows = clientes.map((c) => {
    const isEditing = editingId === c.idCliente
    return {
      key: c.idCliente,
      cells: [
        c.idCliente,
        isEditing ? (
          <input
            className="inline-input"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            autoFocus
          />
        ) : c.nombre,
        isEditing ? (
          <input
            className="inline-input"
            value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
          />
        ) : c.dni,
        isEditing ? (
          <input
            className="inline-input"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
        ) : (c.direccion || '—'),
        isEditing ? (
          <select
            className="inline-select"
            value={form.idTarifa}
            onChange={(e) => setForm({ ...form, idTarifa: e.target.value })}
          >
            <option value="">Sin tarifa</option>
            {tarifas.map((t) => (
              <option key={t.idTarifa} value={t.idTarifa}>
                {t.nombre}
              </option>
            ))}
          </select>
        ) : (c.idTarifa ? (tarifas.find(t => t.idTarifa === c.idTarifa)?.nombre || '—') : '—'),
        <div key="acc" className="action-btns">
          {isEditing ? (
            <>
              <button className="btn btn-success btn-xs" onClick={() => handleSaveInline(c.idCliente)} disabled={saving}>
                {saving ? '...' : 'Guardar'}
              </button>
              <button className="btn btn-ghost btn-xs" onClick={cancelEdit} disabled={saving}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-xs" onClick={() => startEdit(c)}>
                Editar
              </button>
              <button className="btn btn-ghost-danger btn-xs" onClick={() => setDeleteTarget(c)}>
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
      <PanelBlock title="👥 Gestión de Clientes">
        <div className="header-actions">
          <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>
            {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}
          </span>
          <button className="btn btn-primary btn-md" onClick={openCreate}>
            + Nuevo Cliente
          </button>
        </div>
        <ErrorBanner message={error} onRetry={load} />
        {loading ? (
          <Spinner text="Cargando clientes..." />
        ) : (
          <DataTable
            headers={['ID', 'Nombre', 'DNI', 'Dirección', 'Tarifa', 'Acciones']}
            rows={rows}
            emptyMessage="No hay clientes registrados."
          />
        )}
      </PanelBlock>

      {creating && (
        <div className="modal-overlay" onClick={() => !saving && setCreating(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Nuevo Cliente</h3>
            <div className="form-group">
              <label>Nombre</label>
              <input className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} autoFocus />
            </div>
            <div className="form-group">
              <label>DNI</label>
              <input className="form-control" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input className="form-control" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tarifa</label>
              <select className="form-control" value={form.idTarifa} onChange={(e) => setForm({ ...form, idTarifa: e.target.value })}>
                <option value="">Sin tarifa</option>
                {tarifas.map((t) => (
                  <option key={t.idTarifa} value={t.idTarifa}>
                    {t.nombre} — S/. {t.precioKwh}/kWh
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost btn-md" onClick={() => setCreating(false)} disabled={saving}>
                Cancelar
              </button>
              <button className="btn btn-primary btn-md" onClick={handleCreate} disabled={saving || !form.nombre || !form.dni}>
                {saving ? 'Guardando...' : 'Crear Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar Cliente"
        message={`¿Estás seguro de eliminar a "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

CrudClientes.propTypes = {
  addToast: PropTypes.func.isRequired,
}
