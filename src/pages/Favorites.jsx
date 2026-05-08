import { useContext } from 'react'
import { FavoritesContext } from '../App'
import { Header } from '../components/Header'
import { ShowCard } from '../components/ShowCard'
import { EmptyState } from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'

export function Favorites() {
  const { favorites } = useContext(FavoritesContext)
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <main className="page">
        <h1 className="page-title">Mes favoris</h1>

        {favorites.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="Aucun favori"
            text="Ajoutez des spectacles à vos favoris pour les retrouver ici."
            action="Découvrir les spectacles"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="shows-grid" style={{ marginTop: 16 }}>
            {favorites.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
