import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error) {
    console.error('Uncaught UI error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
          <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-[460px] text-[1.5rem] text-[#555555]">
            Please refresh the page or return to the home page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="zm-btn zm-btn-green"
            >
              <span>Reload</span>
            </button>
            <Link
              to="/en"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center justify-center rounded-[8px] border border-[#3665f6] px-6 py-3 text-[1.45rem] font-semibold text-[#3665f6] hover:bg-[#3665f6] hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
