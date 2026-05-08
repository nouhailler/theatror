import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[theatror] Erreur React :', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a0f',
          color: '#f0f0f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎭</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#c0392b', marginBottom: 12 }}>
            L'application a planté
          </h1>
          <p style={{ fontSize: 13, color: '#8888a0', marginBottom: 8, lineHeight: 1.6, maxWidth: 300 }}>
            {this.state.error.message}
          </p>
          <pre style={{
            fontSize: 10, color: '#55556a', marginBottom: 28,
            maxWidth: 320, overflowX: 'auto', textAlign: 'left',
            background: '#111', padding: 8, borderRadius: 6
          }}>
            {this.state.error.stack?.slice(0, 400)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '14px 28px', background: '#c0392b', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer'
            }}
          >
            Recharger l'app
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
