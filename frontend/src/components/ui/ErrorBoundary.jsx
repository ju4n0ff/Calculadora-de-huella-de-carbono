import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: 60, textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <h3 style={{ color: 'var(--ld-blue)', fontWeight: 800, marginBottom: 8 }}>
            Algo salió mal
          </h3>
          <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>
            {this.props.fallbackMsg || 'Ocurrió un error inesperado. Intenta recargar la página.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', background: 'var(--ld-blue)', color: '#fff',
              border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Recargar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
