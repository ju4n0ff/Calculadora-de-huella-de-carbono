const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    let msg
    try {
      const body = await res.json()
      msg = body.message || body.error || JSON.stringify(body)
    } catch {
      msg = await res.text().catch(() => null)
    }
    throw new Error(msg || (res.status === 401 || res.status === 404 ? 'Datos incorrectos' : `Error ${res.status}`))
  }
  return res.json()
}

export function apiGet(path) {
  return fetch(`${BASE}${path}`).then(handleResponse)
}

export function apiPost(path, data) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function apiPut(path, data) {
  return fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function apiDelete(path) {
  return fetch(`${BASE}${path}`, { method: 'DELETE' }).then(handleResponse)
}
