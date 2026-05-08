const LOCALE = 'fr-FR'

export function formatDateShort(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  return d.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' })
}

export function formatDateRange(start, end) {
  if (!start) return ''
  const s = new Date(start)
  const e = end ? new Date(end) : null
  const now = new Date()

  const sameDay = e && s.toDateString() === e.toDateString()
  const alreadyStarted = s < now

  if (sameDay) {
    return `${s.toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' })} à ${s.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' })}`
  }

  if (alreadyStarted && e) {
    return `Jusqu'au ${e.toLocaleDateString(LOCALE, { day: 'numeric', month: 'long' })}`
  }

  const startStr = s.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' })
  const endStr = e ? e.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' }) : null

  return endStr ? `Du ${startStr} au ${endStr}` : `À partir du ${startStr}`
}

export function isTonight(dateStart, dateEnd) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 86400000)

  const s = dateStart ? new Date(dateStart) : null
  const e = dateEnd ? new Date(dateEnd) : null

  if (!s) return false
  // event starts today or is ongoing through today
  return (s >= todayStart && s < todayEnd) || (s < todayEnd && e && e > todayStart)
}

export function isCurrentlyShowing(dateStart, dateEnd) {
  const now = new Date()
  const s = dateStart ? new Date(dateStart) : null
  const e = dateEnd ? new Date(dateEnd) : null
  if (!s) return false
  return s <= now && (!e || e >= now)
}

export function matchesFilter(show, filter) {
  const tags = show.tags.map(t => t.toLowerCase())
  const cat = (show.category || '').toLowerCase()
  const title = (show.title || '').toLowerCase()

  switch (filter) {
    case 'affiche':
      return isCurrentlyShowing(show.dateStart, show.dateEnd)
    case 'soir':
      return isTonight(show.dateStart, show.dateEnd)
    case 'gratuit':
      return show.isFree
    case 'contemporain':
      return tags.some(t => t.includes('contemporain')) || cat.includes('contemporain')
    case 'comedie':
      return tags.some(t => t.includes('comédie') || t.includes('comedie') || t.includes('humour'))
    case 'seul':
      return tags.some(t => t.includes('seul en scène') || t.includes('one man') || t.includes('one woman'))
    default:
      return true
  }
}

export function matchesSearch(show, query) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    show.title.toLowerCase().includes(q) ||
    show.venue.toLowerCase().includes(q) ||
    show.description.toLowerCase().includes(q) ||
    show.tags.some(t => t.toLowerCase().includes(q))
  )
}

export function truncate(text, max = 120) {
  if (!text || text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}
