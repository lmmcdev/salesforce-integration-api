// src/utils/errors.ts

/**
 * Base error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'AUTH_ERROR', 401, details);
  }
}

/**
 * Error thrown when a required configuration is missing or invalid
 */
export class ConfigurationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIG_ERROR', 500, details);
  }
}

/**
 * Error thrown when Key Vault operations fail
 */
export class KeyVaultError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'KEYVAULT_ERROR', 500, details);
  }
}

/**
 * Error thrown when Salesforce API operations fail
 */
export class SalesforceError extends AppError {
  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message, 'SALESFORCE_ERROR', statusCode, details);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

/**
 * Checks if an error is an instance of AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Formats an error for logging or API response
 */
export function formatError(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
} {
  if (isAppError(error)) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }

  return {
    message: String(error),
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}
