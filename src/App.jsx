import { createContext, useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useFavorites } from './hooks/useFavorites'
import { BottomNav } from './components/BottomNav'
import { Home } from './pages/Home'
import { ShowDetail } from './pages/ShowDetail'
import { Favorites } from './pages/Favorites'

export const FavoritesContext = createContext({
  favorites: [],
  toggle: () => {},
  isFavorite: () => false
})

export default function App() {
  const favoritesApi = useFavorites()

  const ctx = useMemo(() => favoritesApi, [favoritesApi.favorites])

  return (
    <FavoritesContext.Provider value={ctx}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </FavoritesContext.Provider>
  )
}
