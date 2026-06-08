const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || body.message || `Error ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  loginCliente: (id) =>
    fetch(`${BASE}/clientes/${id}`)
      .then(handleResponse),

  loginAdmin: (usuario, clave) =>
    fetch(`${BASE}/administradores/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
    }).then(handleResponse),
}

export const clienteApi = {
  listar: () =>
    fetch(`${BASE}/clientes`).then(handleResponse),

  obtenerPorId: (id) =>
    fetch(`${BASE}/clientes/${id}`).then(handleResponse),
}

export const suministroApi = {
  listarPorCliente: (idCliente) =>
    fetch(`${BASE}/suministros/cliente/${idCliente}`).then(handleResponse),
}

export const consumoApi = {
  listar: () =>
    fetch(`${BASE}/consumos`).then(handleResponse),

  listarPorCliente: (idCliente) =>
    fetch(`${BASE}/consumos/cliente/${idCliente}`).then(handleResponse),

  guardar: (data) =>
    fetch(`${BASE}/consumos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
}

export const simulacionApi = {
  listar: () =>
    fetch(`${BASE}/simulaciones`).then(handleResponse),

  guardar: (data) =>
    fetch(`${BASE}/simulaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
}

export const artefactoApi = {
  listar: () =>
    fetch(`${BASE}/artefactos`).then(handleResponse),
}
