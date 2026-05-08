import { useState } from 'react'

export function DebugPanel({ debugInfo }) {
  const [open, setOpen] = useState(true)
  if (!debugInfo) return null

  const passed = debugInfo.strategies.filter(s => s.ok)
  const failed = debugInfo.strategies.filter(s => !s.ok)

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
          width: '100%', padding: '10px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#161b22', color: '#f0f0f5',
          fontSize: 12, fontFamily: 'monospace', cursor: 'pointer', border: 'none'
        }}
      >
        <span>
          🔍 Debug API — {passed.length > 0 ? `✅ "${debugInfo.successLabel}"` : `❌ ${failed.length} échec(s)`}
        </span>
        <span style={{ color: '#8b949e' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '12px 14px', overflowX: 'auto' }}>
          <div style={{ color: '#8b949e', marginBottom: 10 }}>
            Date du jour : <span style={{ color: '#79c0ff' }}>{debugInfo.today}</span>
          </div>

          {debugInfo.strategies.map((s, i) => (
            <div key={i} style={{
              marginBottom: 12, paddingBottom: 12,
              borderBottom: '1px solid #21262d'
            }}>
              <div style={{ color: s.ok ? '#3fb950' : '#f85149', fontWeight: 'bold', marginBottom: 6 }}>
                {s.ok ? '✅' : '❌'} {s.label} — HTTP {s.status ?? 'réseau'}
              </div>

              <div style={{ color: '#8b949e', marginBottom: 2 }}>URL :</div>
              <div style={{
                color: '#79c0ff', wordBreak: 'break-all',
                background: '#010409', padding: '6px 8px', borderRadius: 6, marginBottom: 8
              }}>
                {s.url}
              </div>

              {s.ok && (
                <div style={{ color: '#3fb950', marginBottom: 6 }}>
                  {s.totalCount} résultats total — {s.resultCount} reçus
                </div>
              )}

              {s.ok && s.firstRecordFields && (
                <>
                  <div style={{ color: '#8b949e', marginBottom: 4 }}>
                    Champs disponibles ({s.firstRecordFields.length}) :
                  </div>
                  <div style={{
                    color: '#d2a8ff', background: '#010409',
                    padding: '6px 8px', borderRadius: 6, marginBottom: 6,
                    wordBreak: 'break-all', lineHeight: 1.8
                  }}>
                    {s.firstRecordFields.join(' · ')}
                  </div>
                </>
              )}

              {s.errorBody && (
                <>
                  <div style={{ color: '#8b949e', marginBottom: 4 }}>Erreur API :</div>
                  <pre style={{
                    color: '#ffa657', background: '#010409',
                    padding: '6px 8px', borderRadius: 6, overflowX: 'auto',
                    margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                  }}>
                    {typeof s.errorBody === 'string'
                      ? s.errorBody
                      : JSON.stringify(s.errorBody, null, 2)}
                  </pre>
                </>
              )}

              {s.networkError && (
                <div style={{ color: '#f85149' }}>Réseau : {s.networkError}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
