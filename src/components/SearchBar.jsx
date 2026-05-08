import { useRef } from 'react'

export function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)

  return (
    <div className="search-bar">
      <div className="search-bar__inner">
        <svg className="search-bar__icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className="search-bar__input"
          type="search"
          placeholder="Titre, lieu, catégorie…"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label="Rechercher un spectacle"
        />
        {value && (
          <button
            className="search-bar__clear"
            onClick={() => { onChange(''); inputRef.current?.focus() }}
            aria-label="Effacer la recherche"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
