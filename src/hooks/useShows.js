import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchTheatreShows } from '../services/parisApi'
import { matchesFilter } from '../utils/helpers'

export function useShows() {
  const [allShows, setAllShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [activeFilter, setActiveFilter] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchTheatreShows({ limit: 100 })
      setAllShows(result.shows)
      setTotal(result.total)
    } catch (err) {
      setError(err.message || 'Impossible de charger les spectacles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filteredShows = useMemo(() => {
    if (!activeFilter) return allShows
    return allShows.filter(show => matchesFilter(show, activeFilter))
  }, [allShows, activeFilter])

  return {
    shows: filteredShows,
    loading,
    error,
    total,
    activeFilter,
    setFilter: setActiveFilter,
    reload: load
  }
}
