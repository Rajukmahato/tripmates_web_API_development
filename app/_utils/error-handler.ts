/**
 * Error handling utilities for frontend
 * Centralized error handling to reduce code duplication
 */

export interface ApiError extends Error {
    statusCode?: number;
    message: string;
    errors?: Record<string, string[]>;
}

/**
 * Check if error is an API error with statusCode
 */
export const isApiError = (error: unknown): error is ApiError => {
    return (
        error !== null && 
        typeof error === 'object' && 
        'statusCode' in error && 
        'message' in error
    );
};

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
    // Handle API errors with statusCode
    if (isApiError(error)) {
        return error.message || 'An error occurred';
    }

    // Handle standard Error objects
    if (error instanceof Error) {
        return error.message;
    }

    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }

    // Handle objects with message property
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }

    // Fallback
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Get detailed error info for logging
 */
export const getErrorDetails = (error: unknown) => {
    return {
        message: getErrorMessage(error),
        statusCode: isApiError(error) ? error.statusCode : undefined,
        errors: isApiError(error) ? error.errors : undefined,
        timestamp: new Date().toISOString(),
    };
};

/**
 * Determines if error is user-facing or unexpected
 */
export const isUserFacingError = (statusCode?: number): boolean => {
    return statusCode !== undefined && statusCode >= 400 && statusCode < 500;
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors?: Record<string, string[]>): string => {
    if (!errors) return '';
    
    return Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');
};
