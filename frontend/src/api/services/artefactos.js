const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error del servidor')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json()
}

export const artefactoApi = {
  listar: () => fetch(`${BASE}/artefactos`).then(handleResponse),
}
