import React from 'react';

/**
 * SectionErrorBoundary Component
 * A lighter error boundary for non-critical UI sections like panels.
 * Shows an inline error state rather than blocking the entire app.
 * 
 * Usage:
 * <SectionErrorBoundary name="Design Panel">
 *   <DesignSystemPanel />
 * </SectionErrorBoundary>
 */
class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error with section context
    console.error(`[${this.props.name || 'Section'}] Error:`, error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const sectionName = this.props.name || 'This section';
      
      return (
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="flex items-start gap-3">
            {/* Warning Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white mb-1">
                {sectionName} encountered an error
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                This section failed to load. Other parts of the app are still working.
              </p>
              
              {/* Error Details (dev only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-3 p-2 bg-gray-900 rounded text-xs font-mono text-red-400 break-all overflow-auto max-h-20">
                  {this.state.error.toString()}
                </div>
              )}
              
              <button
                type="button"
                onClick={this.handleRetry}
                className="text-xs text-gray-300 hover:text-white underline transition-colors"
              >
                Try loading again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;

