import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchTheatreShows } from '../services/parisApi'
import { matchesFilter, matchesSearch } from '../utils/helpers'

export function useShows() {
  const [allShows, setAllShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchTheatreShows({ limit: 100 })
      setAllShows(result.shows)
      setTotal(result.total)
      if (result._debug) setDebugInfo(result._debug)
    } catch (err) {
      setError(err.message || 'Impossible de charger les spectacles.')
      if (err.debug) setDebugInfo(err.debug)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filteredShows = useMemo(() => {
    let shows = allShows

    if (activeFilters.length > 0) {
      shows = shows.filter(show =>
        activeFilters.every(f => matchesFilter(show, f))
      )
    }

    if (searchQuery.trim()) {
      shows = shows.filter(show => matchesSearch(show, searchQuery.trim()))
    }

    return shows
  }, [allShows, activeFilters, searchQuery])

  const toggleFilter = useCallback((filter) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setActiveFilters([])
    setSearchQuery('')
  }, [])

  return {
    shows: filteredShows,
    loading,
    error,
    debugInfo,
    total,
    searchQuery,
    setSearchQuery,
    activeFilters,
    toggleFilter,
    clearFilters,
    reload: load
  }
}
