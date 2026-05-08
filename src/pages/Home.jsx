import { Header } from '../components/Header'
import { FilterSelect } from '../components/FilterSelect'
import { ShowCard } from '../components/ShowCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { EmptyState } from '../components/EmptyState'
import { useShows } from '../hooks/useShows'

export function Home() {
  const { shows, loading, error, activeFilter, setFilter, reload } = useShows()

  return (
    <>
      <Header />
      <main className="page">
        <div className="filter-select-bar">
          <FilterSelect value={activeFilter} onChange={setFilter} />
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️</span>
            <div>
              <div>{error}</div>
              <button className="error-banner__retry" onClick={reload}>Réessayer</button>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Chargement des spectacles…" />
        ) : shows.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Aucun spectacle trouvé"
            text="Essayez un autre filtre."
            action={activeFilter ? 'Voir tous les spectacles' : undefined}
            onAction={() => setFilter('')}
          />
        ) : (
          <>
            <p className="results-count" style={{ padding: '0 16px 12px' }}>
              {shows.length} spectacle{shows.length !== 1 ? 's' : ''}
            </p>
            <div className="shows-grid">
              {shows.map(show => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}
