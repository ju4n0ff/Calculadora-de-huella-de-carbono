const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error del servidor')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json()
}

export const tarifaApi = {
  listar: () => fetch(`${BASE}/tarifas`).then(handleResponse),
  obtenerPorId: (id) => fetch(`${BASE}/tarifas/${id}`).then(handleResponse),
  crear: (data) =>
    fetch(`${BASE}/tarifas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  actualizar: (id, data) =>
    fetch(`${BASE}/tarifas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  eliminar: (id) =>
    fetch(`${BASE}/tarifas/${id}`, { method: 'DELETE' }).then(handleResponse),
}
