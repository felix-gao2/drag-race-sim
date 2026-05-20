const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  return res.json()
}

export const getMakes = () =>
  get('/api/makes')

export const getModels = (make) =>
  get(`/api/models?make=${encodeURIComponent(make)}`)

export const getYears = (make, model) =>
  get(`/api/years?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`)

// returns [{id, trim}, ...]
export const getTrims = (make, model, year) =>
  get(`/api/trims?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${year}`)

export const getCar = (id) =>
  get(`/api/cars/${id}`)

export const getRace = (slug) =>
  get(`/api/races/${slug}`)

export async function postRace(carAId, carBId) {
  const res = await fetch(`${BASE}/api/races`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ car_a_id: carAId, car_b_id: carBId }),
  })
  if (!res.ok) throw new Error(`POST /api/races → ${res.status}`)
  return res.json()
}
