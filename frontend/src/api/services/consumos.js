const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error del servidor')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json()
}

export const consumoApi = {
  listar: () => fetch(`${BASE}/consumos`).then(handleResponse),
  listarPorCliente: (idCliente) => fetch(`${BASE}/consumos/cliente/${idCliente}`).then(handleResponse),
  guardar: (data) =>
    fetch(`${BASE}/consumos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
}
