import { useNavigate } from 'react-router-dom'

export function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <span className="header__icon">🎭</span>
        <span>Théatror</span>
      </div>
    </header>
  )
}

export function DetailHeader({ title, onBack, isFavorite, onToggleFavorite, scrolled }) {
  return (
    <div className={`detail-header-bar ${scrolled ? 'scrolled' : ''}`}>
      <button className="header__back" onClick={onBack} aria-label="Retour">
        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Retour
      </button>
      <button
        className={`btn-favorite ${isFavorite ? 'favorited' : ''}`}
        style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
        onClick={onToggleFavorite}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <HeartIcon />
      </button>
    </div>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  )
}
