const FILTERS = [
  { id: 'affiche', label: 'À l\'affiche', icon: '🎬' },
  { id: 'soir',    label: 'Ce soir',      icon: '🌙' },
  { id: 'gratuit', label: 'Gratuit',      icon: '🎁' },
  { id: 'contemporain', label: 'Contemporain', icon: '🖤' },
  { id: 'comedie', label: 'Comédie',      icon: '😄' },
  { id: 'seul',    label: 'Seul en scène', icon: '🎤' }
]

export function FilterBar({ activeFilters, onToggle }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filtres">
      {FILTERS.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`filter-chip ${activeFilters.includes(id) ? 'active' : ''}`}
          onClick={() => onToggle(id)}
          aria-pressed={activeFilters.includes(id)}
        >
          <span className="filter-chip__icon">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )
}
