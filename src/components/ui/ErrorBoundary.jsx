import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * React error boundary — wraps any subtree and shows a friendly fallback
 * instead of a blank screen when a component throws.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeWidget />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  reset() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-6 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Something went wrong</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              This section failed to load. Try refreshing or contact support if the issue persists.
            </p>
          </div>
          <button
            onClick={() => this.reset()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/25
                       text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}