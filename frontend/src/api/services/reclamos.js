const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error del servidor')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json()
}

export const reclamoApi = {
  listar: () => fetch(`${BASE}/reclamos`).then(handleResponse),
  listarPorCliente: (idCliente) => fetch(`${BASE}/reclamos/cliente/${idCliente}`).then(handleResponse),
  crear: (data) =>
    fetch(`${BASE}/reclamos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  responder: (id, data) =>
    fetch(`${BASE}/reclamos/${id}/responder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
}
