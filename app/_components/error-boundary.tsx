"use client";

import React from 'react';
import { Button } from '@/app/_components/ui/button';
import { Card } from '@/app/_components/ui/card';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary to catch React component errors
 * Prevents entire app from crashing on component errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error details for debugging
        console.error('Error caught by boundary:', {
            error: error.toString(),
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <Card className="w-full max-w-md p-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-red-500 mb-2">
                                    Something went wrong
                                </h2>
                                <p className="text-foreground/70 mb-4">
                                    {process.env.NODE_ENV === 'development'
                                        ? this.state.error?.message
                                        : 'An unexpected error occurred. Please try again.'}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={this.handleReset} variant="default">
                                        Try Again
                                    </Button>
                                    <Button onClick={() => window.location.href = '/'} variant="outline">
                                        Go Home
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}

/**
 * Hook to handle async operation errors
 */
export const useAsyncError = () => {
    const [, setError] = React.useState();

    return React.useCallback(
        (error: Error) => {
            setError(() => {
                throw error;
            });
        },
        [setError],
    );
};
