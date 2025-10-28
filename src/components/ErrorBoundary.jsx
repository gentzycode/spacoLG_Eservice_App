import React, { Component } from 'react';
import logger from '../utils/logger';

class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
        errorInfo: null,
        errorCount: 0,
    };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to production error tracking
        logger.error('ErrorBoundary caught an error:', {
            error: error.toString(),
            componentStack: errorInfo.componentStack,
            url: window.location.href,
            userAgent: navigator.userAgent,
        });

        // Track error count to prevent infinite error loops
        this.setState((prevState) => ({
            errorInfo,
            errorCount: prevState.errorCount + 1,
        }));

        // Send to monitoring service in production
        if (import.meta.env.PROD && window.errorTracker) {
            window.errorTracker.captureException(error, {
                contexts: {
                    react: {
                        componentStack: errorInfo.componentStack,
                    },
                },
            });
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // If too many errors, show critical error page
            if (this.state.errorCount > 3) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                        <div className="max-w-md w-full text-center">
                            <div className="mb-6">
                                <svg
                                    className="mx-auto h-16 w-16 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Critical Error
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                The application has encountered multiple errors. Please reload the page or contact support if the issue persists.
                            </p>
                            <button
                                onClick={this.handleReload}
                                className="w-full px-6 py-3 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] hover:text-gray-900 transition-all duration-300 font-medium"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                );
            }

            // Standard error display
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                    <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <div className="text-center">
                            <div className="mb-6">
                                <svg
                                    className="mx-auto h-16 w-16 text-yellow-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Oops! Something went wrong
                            </h2>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {this.state.error?.message || 'An unexpected error occurred.'}
                            </p>

                            {import.meta.env.DEV && this.state.errorInfo && (
                                <details className="mb-6 text-left">
                                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                        Show error details
                                    </summary>
                                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto max-h-40">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={this.handleReset}
                                    className="flex-1 px-6 py-3 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] hover:text-gray-900 transition-all duration-300 font-medium"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={this.handleReload}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Reload Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;