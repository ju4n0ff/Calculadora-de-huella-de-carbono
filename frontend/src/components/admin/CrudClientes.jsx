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
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
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

  const openCreate = () => {
    setEditing(null)
    setForm(emptyCliente)
    setShowForm(true)
  }

  const openEdit = (cliente) => {
    setEditing(cliente)
    setForm({
      nombre: cliente.nombre || '',
      dni: cliente.dni || '',
      direccion: cliente.direccion || '',
      idTarifa: cliente.idTarifa ?? '',
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.nombre || !form.dni) return
    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre,
        dni: form.dni,
        direccion: form.direccion,
        idTarifa: form.idTarifa ? Number(form.idTarifa) : null,
      }
      if (editing) {
        await clienteApi.actualizar(editing.idCliente, payload)
        addToast('Cliente actualizado correctamente.')
      } else {
        await clienteApi.crear(payload)
        addToast('Cliente creado correctamente.')
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
      await clienteApi.eliminar(deleteTarget.idCliente)
      addToast('Cliente eliminado correctamente.')
      setDeleteTarget(null)
      await load()
    } catch (err) {
      addToast('Error al eliminar: ' + (err.message || 'desconocido'))
    }
  }

  const rows = clientes.map((c) => ({
    key: c.idCliente,
    cells: [
      c.idCliente,
      c.nombre,
      c.dni,
      c.direccion,
      c.idTarifa ? `Tarifa #${c.idTarifa}` : '—',
      <div key="acciones" style={{ display: 'flex', gap: 8 }}>
        <button className="btn-flat-info" onClick={() => openEdit(c)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
          Editar
        </button>
        <button className="btn-flat-danger" onClick={() => setDeleteTarget(c)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
          Eliminar
        </button>
      </div>,
    ],
  }))

  return (
    <>
      <PanelBlock title="👥 Gestión de Clientes">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn-primary" onClick={openCreate} style={{ width: 'auto', padding: '10px 24px' }}>
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

      {showForm && (
        <div className="modal-overlay" onClick={() => !saving && setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--ld-blue)', marginBottom: 20 }}>
              {editing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <div className="form-group">
              <label>Nombre</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="form-group">
              <label>DNI</label>
              <input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tarifa</label>
              <select value={form.idTarifa} onChange={(e) => setForm({ ...form, idTarifa: e.target.value })}>
                <option value="">Sin tarifa</option>
                {tarifas.map((t) => (
                  <option key={t.idTarifa} value={t.idTarifa}>
                    {t.nombre} — S/. {t.precioKwh}/kWh
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={saving || !form.nombre || !form.dni}>
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
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
