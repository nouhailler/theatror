const BASE_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records'
const CACHE_KEY = 'theatror_api'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// ODS v2.1 : q = full-text search, where = filtre scalaire (dates)
// Champs réels confirmés : qfap_tags, univers, universe_tags (pas "tags" ni "category")
const SEARCH_QUERY = 'théâtre spectacle comédie'

function normalizeShow(record) {
  const tags = parseTags(record.qfap_tags)
  const universeTags = parseTags(record.universe_tags)
  const category = record.univers || universeTags[0] || ''

  const isFree =
    (record.price_type || '').toLowerCase().includes('gratuit') ||
    (record.price_detail || '').toLowerCase().includes('gratuit')

  return {
    id: record.id || record.event_id || (record.title + record.date_start),
    title: record.title || 'Sans titre',
    description: stripHtml(record.description || record.lead_text || ''),
    dateStart: record.date_start || null,
    dateEnd: record.date_end || null,
    occurrences: record.occurrences || null,
    dateDescription: record.date_description || '',
    venue: record.address_name || '',
    address: [record.address_street, record.address_zipcode, record.address_city]
      .filter(Boolean).join(', '),
    addressStreet: record.address_street || '',
    zipcode: record.address_zipcode || '',
    city: record.address_city || 'Paris',
    tags,
    universeTags,
    category,
    image: record.cover_url || null,
    isFree,
    priceDetail: record.price_detail || (isFree ? 'Gratuit' : ''),
    url: record.url || record.contact_url || '',
    transport: record.transport || '',
    pmr: record.pmr || false,
    coordinates: record.lat_lon
      ? { lat: record.lat_lon.lat, lon: record.lat_lon.lon }
      : null
  }
}

function parseTags(tags) {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.map(t => t.trim()).filter(Boolean)
  if (typeof tags === 'string') return tags.split(';').map(t => t.trim()).filter(Boolean)
  return []
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim()
}

function getCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null }
    return data
  } catch { return null }
}

function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

export async function fetchTheatreShows({ offset = 0, limit = 100 } = {}) {
  const cacheKey = `${CACHE_KEY}_${offset}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const today = new Date().toISOString().split('T')[0]
  const params = new URLSearchParams({
    q: SEARCH_QUERY,
    where: `date_end >= "${today}"`,
    order_by: 'date_start ASC',
    limit,
    offset
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status} — ${body.slice(0, 200)}`)
  }

  const json = await res.json()
  const result = {
    total: json.total_count || 0,
    shows: (json.results || []).map(normalizeShow)
  }

  setCache(cacheKey, result)
  return result
}

export function clearCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_KEY))
    .forEach(k => localStorage.removeItem(k))
}
