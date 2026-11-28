import { Component } from 'react'

// Catches render errors in the page tree so one broken page shows a message
// instead of a blank screen. Navbar and Footer stay outside it.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="page page-centered">
        <div className="container">
          <div className="card" role="alert">
            <h2>Something went wrong</h2>
            <p>An unexpected error occurred. Try reloading the page.</p>
            <button type="button" className="btn" onClick={() => window.location.reload()}>
              <span>Reload page</span>
            </button>
          </div>
        </div>
      </main>
    )
  }
}
