const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error del servidor')
    throw new Error(msg || (res.status === 401 || res.status === 404 ? 'Datos incorrectos' : `Error ${res.status}`))
  }
  return res.json()
}

export const authApi = {
  loginCliente: (id) => fetch(`${BASE}/clientes/${id}`).then(handleResponse),
  loginAdmin: (usuario, clave) =>
    fetch(`${BASE}/administradores/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
    }).then(handleResponse),
}
