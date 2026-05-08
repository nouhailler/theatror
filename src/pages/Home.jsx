import { Header } from '../components/Header'
import { SearchBar } from '../components/SearchBar'
import { FilterBar } from '../components/FilterBar'
import { ShowCard } from '../components/ShowCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { EmptyState } from '../components/EmptyState'
import { useShows } from '../hooks/useShows'

export function Home() {
  const {
    shows,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFilters,
    toggleFilter,
    clearFilters,
    reload
  } = useShows()

  const hasActiveFilters = activeFilters.length > 0 || searchQuery.trim()

  return (
    <>
      <Header />
      <main className="page">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar activeFilters={activeFilters} onToggle={toggleFilter} />

        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️</span>
            <div>
              <div>{error}</div>
              <button className="error-banner__retry" onClick={reload}>
                Réessayer
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Chargement des spectacles…" />
        ) : (
          <>
            <div className="results-header">
              <span className="results-count">
                {shows.length} spectacle{shows.length !== 1 ? 's' : ''}
              </span>
              {hasActiveFilters && (
                <button className="results-clear" onClick={clearFilters}>
                  Effacer les filtres
                </button>
              )}
            </div>

            {shows.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="Aucun spectacle trouvé"
                text={hasActiveFilters
                  ? 'Essayez de modifier vos filtres ou votre recherche.'
                  : 'Aucun spectacle disponible pour le moment.'}
                action={hasActiveFilters ? 'Effacer les filtres' : undefined}
                onAction={clearFilters}
              />
            ) : (
              <div className="shows-grid">
                {shows.map(show => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
