const BASE_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records'
const CACHE_KEY = 'theatror_api'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// ODS v2.1 : le paramètre `q` fait une recherche full-text sur tous les champs indexés.
// Le paramètre `where` fonctionne uniquement pour des comparaisons scalaires (dates, nombres).
// `like` sur un champ `tags` array retourne 400 → utiliser `q` + `refine` à la place.

function buildStrategies(today) {
  return [
    // Stratégie 1 : q full-text + filtre date (approche recommandée ODS)
    {
      label: 'q=théâtre + where date',
      params: {
        q: 'théâtre spectacle comédie',
        where: `date_end >= "${today}"`,
        order_by: 'date_start ASC',
        limit: 100
      }
    },
    // Stratégie 2 : q full-text sans filtre date
    {
      label: 'q=théâtre (sans date)',
      params: {
        q: 'théâtre spectacle comédie',
        order_by: 'date_start ASC',
        limit: 100
      }
    },
    // Stratégie 3 : refine sur le champ tags (facette ODS exacte)
    {
      label: 'refine=tags:Théâtre',
      params: {
        refine: 'tags:Théâtre',
        order_by: 'date_start ASC',
        limit: 100
      }
    },
    // Stratégie 4 : where date uniquement (sans filtre théâtre)
    {
      label: 'where date uniquement',
      params: {
        where: `date_end >= "${today}"`,
        order_by: 'date_start ASC',
        limit: 100
      }
    },
    // Stratégie 5 : aucun filtre — dernier recours
    {
      label: 'aucun filtre',
      params: { limit: 100 }
    }
  ]
}

function normalizeShow(record) {
  const tags = parseTags(record.tags)
  const isFree =
    (record.price_type || '').toLowerCase().includes('gratuit') ||
    (record.price_detail || '').toLowerCase().includes('gratuit')

  return {
    id: record.id || (record.title + record.date_start),
    title: record.title || 'Sans titre',
    description: stripHtml(record.description || record.lead_text || ''),
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

export async function fetchTheatreShows({ offset = 0 } = {}) {
  const cacheKey = `${CACHE_KEY}_${offset}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const today = new Date().toISOString().split('T')[0]
  const strategies = buildStrategies(today)
  const debugInfo = { strategies: [], today }

  for (const strategy of strategies) {
    const params = new URLSearchParams(strategy.params)
    const url = `${BASE_URL}?${params}`
    const stratResult = { label: strategy.label, url, status: null, ok: false }

    console.group(`[theatror] ${strategy.label}`)
    console.log('URL:', url)

    try {
      const res = await fetch(url)
      const body = await res.text()
      stratResult.status = res.status

      if (!res.ok) {
        let parsed
        try { parsed = JSON.parse(body) } catch { parsed = body }
        stratResult.errorBody = parsed
        console.warn(`HTTP ${res.status}:`, parsed)
        console.groupEnd()
        debugInfo.strategies.push(stratResult)
        continue
      }

      const json = JSON.parse(body)
      stratResult.ok = true
      stratResult.totalCount = json.total_count
      stratResult.resultCount = (json.results || []).length

      // Log des vrais noms de champs du 1er résultat pour diagnostiquer la structure
      if (json.results?.[0]) {
        stratResult.firstRecordFields = Object.keys(json.results[0])
        console.log('Champs du 1er enregistrement :', stratResult.firstRecordFields)
        console.log('1er enregistrement :', json.results[0])
      }

      console.log(`✅ ${json.total_count} résultats, ${stratResult.resultCount} reçus`)
      console.groupEnd()
      debugInfo.strategies.push(stratResult)
      debugInfo.successLabel = strategy.label

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

  const err = new Error('API inaccessible après toutes les stratégies')
  err.debug = debugInfo
  throw err
}

export function clearCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_KEY))
    .forEach(k => localStorage.removeItem(k))
}
