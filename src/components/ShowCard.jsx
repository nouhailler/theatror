import { useNavigate } from 'react-router-dom'
import { formatDateRange, truncate, isTonight } from '../utils/helpers'

export function ShowCard({ show }) {
  const navigate = useNavigate()
  const tonight = isTonight(show.dateStart, show.dateEnd)

  return (
    <article
      className="show-card"
      onClick={() => navigate(`/show/${encodeURIComponent(show.id)}`)}
      role="button"
      tabIndex={0}
      aria-label={`Voir le détail de ${show.title}`}
      onKeyDown={e => e.key === 'Enter' && navigate(`/show/${encodeURIComponent(show.id)}`)}
    >
      <div className="show-card__image-wrap">
        {show.image ? (
          <img
            className="show-card__image"
            src={show.image}
            alt={show.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="show-card__image-placeholder">🎭</div>
        )}
        {show.isFree && <span className="show-card__badge show-card__badge--free">Gratuit</span>}
        {!show.isFree && tonight && (
          <span className="show-card__badge show-card__badge--soir">Ce soir</span>
        )}
      </div>

      <div className="show-card__body">
        {show.category && (
          <div className="show-card__category">{show.category}</div>
        )}
        <h2 className="show-card__title">{show.title}</h2>

        {show.venue && (
          <div className="show-card__venue">
            <PinIcon />
            {show.venue}
          </div>
        )}

        <div className="show-card__date">
          <CalendarIcon />
          {formatDateRange(show.dateStart, show.dateEnd)}
        </div>

        {show.description && (
          <p className="show-card__desc">{truncate(show.description, 110)}</p>
        )}

        <div className="show-card__footer">
          <div className="show-card__tags">
            {show.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
          <button
            className="btn-more"
            onClick={e => { e.stopPropagation(); navigate(`/show/${encodeURIComponent(show.id)}`) }}
          >
            Voir plus
          </button>
        </div>
      </div>
    </article>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
