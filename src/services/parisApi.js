const BASE_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records'
const CACHE_KEY = 'theatror_api'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// Wildcards ODSQL : * (pas %) en v2.1
const THEATRE_WHERE =
  `(tags like "*théâtre*" OR tags like "*theatre*" OR tags like "*spectacle*" OR ` +
  `tags like "*comédie*" OR tags like "*comedie*" OR tags like "*seul en scène*" OR ` +
  `tags like "*théâtre contemporain*" OR category like "*Spectacles*")`

function normalizeShow(record) {
  const tags = parseTags(record.tags)
  const isFree =
    (record.price_type || '').toLowerCase().includes('gratuit') ||
    (record.price_detail || '').toLowerCase().includes('gratuit') ||
    (record.price_detail || '') === '' && (record.price_type || '') === ''

  return {
    id: record.id || record.title + record.date_start,
    title: record.title || 'Sans titre',
    description: stripHtml(record.description || record.lead_text || ''),
    descriptionHtml: record.description || record.lead_text || '',
    dateStart: record.date_start || null,
    dateEnd: record.date_end || null,
    venue: record.address_name || '',
    address: [record.address_street, record.address_zipcode, record.address_city]
      .filter(Boolean).join(', '),
    addressStreet: record.address_street || '',
    zipcode: record.address_zipcode || '',
    city: record.address_city || 'Paris',
    tags,
    category: record.category || '',
    image: record.cover_url || record.image || null,
    isFree,
    priceDetail: record.price_detail || (isFree ? 'Gratuit' : ''),
    url: record.url || record.contact_url || '',
    transport: record.transport || '',
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
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function getCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // quota exceeded — silent fail
  }
}

// Tentatives successives : on retire les clauses une à une pour isoler l'erreur
const QUERY_STRATEGIES = [
  // Stratégie 1 : filtre théâtre + date future
  (today) => ({
    where: `${THEATRE_WHERE} AND date_end >= "${today}"`,
    order_by: 'date_start ASC'
  }),
  // Stratégie 2 : filtre théâtre sans contrainte de date
  () => ({
    where: THEATRE_WHERE,
    order_by: 'date_start ASC'
  }),
  // Stratégie 3 : filtre minimal sur un seul tag
  () => ({
    where: 'tags like "*théâtre*"',
    order_by: 'date_start ASC'
  }),
  // Stratégie 4 : aucun filtre (brut, pour vérifier que l'API répond)
  () => ({})
]

export async function fetchTheatreShows({ limit = 100, offset = 0 } = {}) {
  const cacheKey = `${CACHE_KEY}_${offset}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const today = new Date().toISOString().split('T')[0]
  const debugInfo = { strategies: [] }

  for (let i = 0; i < QUERY_STRATEGIES.length; i++) {
    const queryParams = QUERY_STRATEGIES[i](today)
    const params = new URLSearchParams({ limit, offset, ...queryParams })
    const url = `${BASE_URL}?${params}`

    console.group(`[theatror] Stratégie ${i + 1}/${QUERY_STRATEGIES.length}`)
    console.log('URL:', url)

    let stratResult = { strategy: i + 1, url, params: queryParams }

    try {
      const res = await fetch(url)
      const body = await res.text()

      stratResult.status = res.status
      stratResult.ok = res.ok

      if (!res.ok) {
        let parsed
        try { parsed = JSON.parse(body) } catch { parsed = body }
        stratResult.errorBody = parsed
        console.warn(`HTTP ${res.status}:`, parsed)
        console.groupEnd()
        debugInfo.strategies.push(stratResult)
        continue // essaie la stratégie suivante
      }

      const json = JSON.parse(body)
      stratResult.totalCount = json.total_count
      stratResult.resultCount = (json.results || []).length
      console.log(`✅ OK — ${json.total_count} résultats, ${stratResult.resultCount} reçus`)
      console.groupEnd()
      debugInfo.strategies.push(stratResult)
      debugInfo.successStrategy = i + 1

      // Log complet disponible dans la console
      console.info('[theatror] Debug complet:', debugInfo)

      const result = {
        total: json.total_count || 0,
        shows: (json.results || []).map(normalizeShow),
        _debug: debugInfo
      }
      setCache(cacheKey, result)
      return result

    } catch (networkErr) {
      stratResult.networkError = networkErr.message
      console.error('Erreur réseau:', networkErr.message)
      console.groupEnd()
      debugInfo.strategies.push(stratResult)
    }
  }

  // Toutes les stratégies ont échoué
  console.error('[theatror] Toutes les stratégies ont échoué:', debugInfo)
  const err = new Error('API inaccessible — voir console pour le détail')
  err.debug = debugInfo
  throw err
}

export function clearCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_KEY))
    .forEach(k => localStorage.removeItem(k))
}
