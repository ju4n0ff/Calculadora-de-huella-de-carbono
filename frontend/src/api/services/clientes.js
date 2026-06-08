const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error del servidor')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json()
}

export const clienteApi = {
  listar: () => fetch(`${BASE}/clientes`).then(handleResponse),
  obtenerPorId: (id) => fetch(`${BASE}/clientes/${id}`).then(handleResponse),
  crear: (data) =>
    fetch(`${BASE}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  actualizar: (id, data) =>
    fetch(`${BASE}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  eliminar: (id) =>
    fetch(`${BASE}/clientes/${id}`, { method: 'DELETE' }).then(handleResponse),
}
