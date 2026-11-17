import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl mb-6">
            <AlertTriangle size={48} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
            Something went unexpectedly wrong
          </h1>
          <p className="text-sm text-slate-400 max-w-md mb-8">
            An unexpected error occurred in this view. Don't worry, your profile and application data are safe.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <RefreshCw size={16} /> Reload Page
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/dashboard';
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl font-bold text-sm transition-all"
            >
              <Home size={16} /> Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

