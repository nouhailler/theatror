import { useEffect, useRef, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FavoritesContext } from '../App'
import { fetchTheatreShows } from '../services/parisApi'
import { formatDateRange } from '../utils/helpers'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { EmptyState } from '../components/EmptyState'

export function ShowDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggle } = useContext(FavoritesContext)
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const pageRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchTheatreShows({ limit: 100 })
      .then(result => {
        if (cancelled) return
        const found = result.shows.find(s => s.id === decodeURIComponent(id))
        setShow(found || null)
      })
      .catch(() => setShow(null))
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 10)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  if (loading) {
    return (
      <div className="page page--detail" ref={pageRef}>
        <BackBar scrolled={false} onBack={() => navigate(-1)} isFavorite={false} onFav={() => {}} />
        <LoadingSpinner text="Chargement…" />
      </div>
    )
  }

  if (!show) {
    return (
      <div className="page page--detail" ref={pageRef}>
        <BackBar scrolled onBack={() => navigate(-1)} isFavorite={false} onFav={() => {}} />
        <div style={{ marginTop: 80 }}>
          <EmptyState
            icon="😕"
            title="Spectacle introuvable"
            text="Ce spectacle n'existe plus ou a été déprogrammé."
            action="Retour au programme"
            onAction={() => navigate('/')}
          />
        </div>
      </div>
    )
  }

  const fav = isFavorite(show.id)

  return (
    <div className="page page--detail" ref={pageRef} style={{ paddingBottom: 0, overflowY: 'auto' }}>
      <BackBar scrolled={scrolled} onBack={() => navigate(-1)} isFavorite={fav} onFav={() => toggle(show)} />

      {/* Hero image */}
      <div className="detail-hero">
        {show.image ? (
          <img className="detail-hero__img" src={show.image} alt={show.title} loading="eager" />
        ) : (
          <div className="detail-hero__placeholder">🎭</div>
        )}
        <div className="detail-hero__gradient" />
      </div>

      {/* Content */}
      <div className="detail-content">
        {show.category && <div className="detail-category">{show.category}</div>}
        <h1 className="detail-title">{show.title}</h1>

        {/* Price badge */}
        <div className={`detail-price ${show.isFree ? 'detail-price--free' : 'detail-price--paid'}`}>
          {show.isFree ? '🎁 Gratuit' : (show.priceDetail || '💳 Payant')}
        </div>

        {/* Meta block */}
        <div className="detail-meta">
          {(show.dateStart || show.dateEnd) && (
            <div className="detail-meta__row">
              <CalendarIcon />
              <div>
                <div className="detail-meta__label">Dates</div>
                <div className="detail-meta__value">
                  {formatDateRange(show.dateStart, show.dateEnd)}
                </div>
              </div>
            </div>
          )}

          {show.venue && (
            <div className="detail-meta__row">
              <PinIcon />
              <div>
                <div className="detail-meta__label">Lieu</div>
                <div className="detail-meta__value">{show.venue}</div>
                {show.addressStreet && (
                  <div className="detail-meta__value" style={{ color: 'var(--text2)', fontSize: 13 }}>
                    {show.addressStreet}{show.zipcode ? `, ${show.zipcode}` : ''} Paris
                  </div>
                )}
              </div>
            </div>
          )}

          {show.transport && (
            <div className="detail-meta__row">
              <MetroIcon />
              <div>
                <div className="detail-meta__label">Transports</div>
                <div className="detail-meta__value">{show.transport}</div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {show.description && (
          <>
            <div className="detail-desc-title">À propos</div>
            <p className="detail-desc">{show.description}</p>
          </>
        )}

        {/* Tags */}
        {show.tags.length > 0 && (
          <div className="detail-tags">
            {show.tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="detail-actions">
          <button
            className={`btn-favorite ${fav ? 'favorited' : ''}`}
            onClick={() => toggle(show)}
          >
            <HeartIcon />
            {fav ? 'Retiré des favoris' : 'Ajouter aux favoris'}
          </button>

          {show.url && (
            <a
              className="btn-link"
              href={show.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Voir la page officielle (nouvel onglet)"
            >
              <ExternalIcon />
              Page officielle
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function BackBar({ scrolled, onBack, isFavorite, onFav }) {
  return (
    <div className={`detail-header-bar ${scrolled ? 'scrolled' : ''}`}>
      <button className="header__back" onClick={onBack} aria-label="Retour">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="var(--accent)" strokeWidth={2.2}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Retour
      </button>
      <button
        className={`btn-favorite ${isFavorite ? 'favorited' : ''}`}
        style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
        onClick={onFav}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <HeartIcon />
      </button>
    </div>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="detail-meta__icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="detail-meta__icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function MetroIcon() {
  return (
    <svg className="detail-meta__icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
