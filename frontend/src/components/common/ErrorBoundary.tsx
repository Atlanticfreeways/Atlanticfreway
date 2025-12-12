import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl w-full">
                        <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h1>
                        <pre className="bg-black/50 p-4 rounded overflow-auto text-sm font-mono mb-4 text-red-200">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <p className="text-gray-400">Please check the console for more details.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
