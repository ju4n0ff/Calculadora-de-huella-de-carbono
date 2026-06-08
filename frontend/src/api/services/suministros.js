const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error del servidor')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json()
}

export const suministroApi = {
  listarTodos: () => fetch(`${BASE}/suministros`).then(handleResponse),
  listarPorCliente: (idCliente) => fetch(`${BASE}/suministros/cliente/${idCliente}`).then(handleResponse),
  crear: (data) =>
    fetch(`${BASE}/suministros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  actualizarEstado: (id, estado) =>
    fetch(`${BASE}/suministros/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    }).then(handleResponse),
}
