import { useState } from 'react'

export function DebugPanel({ debugInfo }) {
  const [open, setOpen] = useState(true)
  if (!debugInfo) return null

  return (
    <div style={{
      margin: '12px 16px',
      background: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: 10,
      overflow: 'hidden',
      fontFamily: 'monospace',
      fontSize: 12
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#161b22',
          color: '#f0f0f5',
          fontSize: 12,
          fontFamily: 'monospace',
          cursor: 'pointer',
          border: 'none'
        }}
      >
        <span>🔍 Debug API — {debugInfo.strategies?.length ?? 0} stratégie(s) testée(s)</span>
        <span style={{ color: '#8b949e' }}>{open ? '▲ fermer' : '▼ ouvrir'}</span>
      </button>

      {open && (
        <div style={{ padding: '12px 14px', overflowX: 'auto' }}>
          {debugInfo.successStrategy && (
            <div style={{ color: '#3fb950', marginBottom: 10 }}>
              ✅ Succès avec la stratégie #{debugInfo.successStrategy}
            </div>
          )}
          {!debugInfo.successStrategy && (
            <div style={{ color: '#f85149', marginBottom: 10 }}>
              ❌ Toutes les stratégies ont échoué
            </div>
          )}

          {debugInfo.strategies?.map((s, i) => (
            <div key={i} style={{
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: '1px solid #21262d'
            }}>
              <div style={{ color: s.ok ? '#3fb950' : '#f85149', fontWeight: 'bold', marginBottom: 4 }}>
                Stratégie #{s.strategy} — HTTP {s.status ?? 'N/A'} {s.ok ? '✅' : '❌'} {s.networkError ? '(réseau)' : ''}
              </div>

              <div style={{ color: '#8b949e', marginBottom: 4 }}>URL :</div>
              <div style={{
                color: '#79c0ff',
                wordBreak: 'break-all',
                background: '#010409',
                padding: '6px 8px',
                borderRadius: 6,
                marginBottom: 8
              }}>
                {s.url}
              </div>

              {s.errorBody && (
                <>
                  <div style={{ color: '#8b949e', marginBottom: 4 }}>Réponse erreur :</div>
                  <pre style={{
                    color: '#ffa657',
                    background: '#010409',
                    padding: '6px 8px',
                    borderRadius: 6,
                    overflowX: 'auto',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {typeof s.errorBody === 'string'
                      ? s.errorBody
                      : JSON.stringify(s.errorBody, null, 2)}
                  </pre>
                </>
              )}

              {s.networkError && (
                <div style={{ color: '#f85149' }}>Erreur réseau : {s.networkError}</div>
              )}

              {s.ok && (
                <div style={{ color: '#3fb950' }}>
                  {s.totalCount} résultats au total, {s.resultCount} reçus
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
