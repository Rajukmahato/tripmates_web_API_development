import {
  isApiError,
  getErrorMessage,
  getErrorDetails,
  isUserFacingError,
  formatValidationErrors,
} from '@/app/_utils/error-handler';

describe('error-handler utils', () => {
  it('detects API errors by statusCode and message', () => {
    const error = new Error('Bad request');
    Object.assign(error, { statusCode: 400 });
    expect(isApiError(error)).toBe(true);
  });

  it('returns false for non-API errors', () => {
    expect(isApiError({ message: 'Only message' })).toBe(false);
  });

  it('extracts message from api error', () => {
    const error = new Error('Not found');
    Object.assign(error, { statusCode: 404 });
    expect(getErrorMessage(error)).toBe('Not found');
  });

  it('extracts message from Error instance', () => {
    expect(getErrorMessage(new Error('Boom'))).toBe('Boom');
  });

  it('extracts message from string', () => {
    expect(getErrorMessage('oops')).toBe('oops');
  });

  it('returns fallback message for unknown input', () => {
    expect(getErrorMessage(123)).toBe('An unexpected error occurred. Please try again.');
  });

  it('returns detailed error info payload', () => {
    const error = new Error('Validation failed');
    Object.assign(error, {
      statusCode: 422,
      errors: { email: ['Invalid email'] },
    });
    
    const details = getErrorDetails(error);

    expect(details.message).toBe('Validation failed');
    expect(details.statusCode).toBe(422);
    expect(details.errors).toEqual({ email: ['Invalid email'] });
    expect(typeof details.timestamp).toBe('string');
  });

  it('marks 4xx errors as user-facing', () => {
    expect(isUserFacingError(400)).toBe(true);
    expect(isUserFacingError(499)).toBe(true);
  });

  it('does not mark undefined and 5xx errors as user-facing', () => {
    expect(isUserFacingError(undefined)).toBe(false);
    expect(isUserFacingError(500)).toBe(false);
  });

  it('formats validation errors into readable string', () => {
    expect(
      formatValidationErrors({
        email: ['Required', 'Must be valid'],
        password: ['Too short'],
      })
    ).toBe('email: Required, Must be valid\npassword: Too short');
  });

  it('returns empty string when no validation errors exist', () => {
    expect(formatValidationErrors(undefined)).toBe('');
  });
});
