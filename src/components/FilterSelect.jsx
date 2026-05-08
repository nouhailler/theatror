const OPTIONS = [
  { value: '',             label: 'Tous les spectacles' },
  { value: 'affiche',      label: '🎬  À l\'affiche' },
  { value: 'soir',         label: '🌙  Ce soir' },
  { value: 'gratuit',      label: '🎁  Gratuit' },
  { value: 'contemporain', label: '🖤  Théâtre contemporain' },
  { value: 'comedie',      label: '😄  Comédie' },
  { value: 'seul',         label: '🎤  Seul en scène' },
]

export function FilterSelect({ value, onChange }) {
  return (
    <div className="filter-select-wrap">
      <select
        className="filter-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Filtrer les spectacles"
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="filter-select-chevron" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  )
}
