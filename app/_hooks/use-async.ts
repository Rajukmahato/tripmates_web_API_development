"use client";

import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/app/_utils/error-handler';

/**
 * Hook for handling async operations with loading and error states
 */
export const useAsync = <T,>(
    asyncFunction: () => Promise<T>,
    immediate: boolean = true
) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            return response;
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            setError(message);
            setStatus('error');
            throw err;
        }
    }, [asyncFunction]);

    // Auto-execute on mount if immediate is true
    if (immediate && status === 'idle') {
        execute();
    }

    return { status, data, error, execute };
};

/**
 * Hook for lazy async operations
 */
export const useLazyAsync = <T,>(asyncFunction: () => Promise<T>) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(async () => {
        setStatus('pending');
        setIsLoading(true);
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            setIsLoading(false);
            return response;
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            setError(message);
            setStatus('error');
            setIsLoading(false);
            throw err;
        }
    }, [asyncFunction]);

    return { 
        status, 
        data, 
        error, 
        execute, 
        isLoading,
        reset: () => {
            setStatus('idle');
            setData(null);
            setError(null);
            setIsLoading(false);
        }
    };
};

/**
 * Hook for handling async mutations (POST, PUT, DELETE)
 */
export const useAsyncMutation = <TData, TResponse = unknown>(
    mutationFn: (data: TData) => Promise<TResponse>
) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<TResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const mutate = useCallback(
        async (variables: TData) => {
            setStatus('pending');
            setIsLoading(true);
            setError(null);

            try {
                const response = await mutationFn(variables);
                setData(response);
                setStatus('success');
                setIsLoading(false);
                return response;
            } catch (err: unknown) {
                const message = getErrorMessage(err);
                setError(message);
                setStatus('error');
                setIsLoading(false);
                throw err;
            }
        },
        [mutationFn]
    );

    return {
        mutate,
        status,
        data,
        error,
        isLoading,
        reset: () => {
            setStatus('idle');
            setData(null);
            setError(null);
            setIsLoading(false);
        }
    };
};
