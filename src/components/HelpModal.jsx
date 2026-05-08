import { useEffect } from 'react'

const TODAY = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export function HelpModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="help-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Aide">
      <div className="help-sheet" onClick={e => e.stopPropagation()}>

        <div className="help-handle" />

        <div className="help-header">
          <span className="help-title">À propos de Théatror</span>
          <button className="help-close" onClick={onClose} aria-label="Fermer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="help-body">

          <section className="help-section">
            <h3 className="help-section__title">🎭 Comment ça marche</h3>
            <p className="help-section__text">
              Théatror récupère en temps réel les événements de théâtre
              à Paris et les affiche sous forme de programme consultable.
              Sélectionne un filtre dans le menu déroulant pour affiner
              les résultats, puis appuie sur une carte pour voir le détail
              complet du spectacle.
            </p>
          </section>

          <section className="help-section">
            <h3 className="help-section__title">📡 Ce qu'on récupère</h3>
            <p className="help-section__text">
              Au {TODAY}, l'application charge les spectacles dont
              la date de fin est <strong>supérieure ou égale à aujourd'hui</strong>,
              filtrés par recherche sur les mots-clés :{' '}
              <em>théâtre, spectacle, comédie</em>.
            </p>
            <div className="help-tag-row">
              {['À l\'affiche','Ce soir','Gratuit','Contemporain','Comédie','Seul en scène']
                .map(f => <span key={f} className="help-tag">{f}</span>)}
            </div>
            <p className="help-section__text" style={{ marginTop: 10 }}>
              Les données sont mises en cache localement pendant{' '}
              <strong>30 minutes</strong> pour limiter les appels réseau.
            </p>
          </section>

          <section className="help-section">
            <h3 className="help-section__title">🗂 Source des données</h3>
            <p className="help-section__text">
              Toutes les informations proviennent du portail{' '}
              <strong>Open Data de la Ville de Paris</strong>, dataset public
              « Que faire à Paris ? », mis à jour quotidiennement par la mairie.
            </p>
            <div className="help-source-box">
              <span className="help-source-label">Endpoint</span>
              <span className="help-source-url">
                opendata.paris.fr/api/explore/v2.1/…/que-faire-a-paris-
              </span>
            </div>
            <p className="help-section__text" style={{ marginTop: 10 }}>
              Les favoris sont stockés <strong>uniquement sur ton téléphone</strong>{' '}
              (localStorage). Aucune donnée personnelle n'est collectée ou transmise.
            </p>
          </section>

          <section className="help-section">
            <h3 className="help-section__title">⭐ Favoris</h3>
            <p className="help-section__text">
              Appuie sur le cœur dans la page détail pour sauvegarder
              un spectacle. Retrouve tes favoris via l'onglet du bas.
              Ils persistent entre les sessions, même hors connexion.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
