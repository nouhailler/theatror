import { useState, useEffect, useCallback } from 'react'

const KEY = 'theatror_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const toggle = useCallback((show) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === show.id)
      return exists ? prev.filter(f => f.id !== show.id) : [show, ...prev]
    })
  }, [])

  const isFavorite = useCallback((id) => {
    return favorites.some(f => f.id === id)
  }, [favorites])

  return { favorites, toggle, isFavorite }
}
