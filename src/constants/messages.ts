// src/constants/messages.ts

/**
 * Standard messages used across the application
 */
export const Messages = {
  // Health check
  HEALTH_CHECK_SUCCESS: 'Service is healthy and running',
  HEALTH_CHECK_DEGRADED: 'Service is running but degraded',

  // Authentication
  AUTH_SUCCESS: 'Authentication successful',
  AUTH_FAILED: 'Authentication failed',
  AUTH_REQUIRED: 'Authentication required',
  AUTH_TOKEN_MISSING: 'Access token is missing',

  // Salesforce
  SF_AUTH_SUCCESS: 'Successfully authenticated with Salesforce',
  SF_AUTH_FAILED: 'Failed to authenticate with Salesforce',
  SF_CONNECTION_SUCCESS: 'Successfully connected to Salesforce',
  SF_CONNECTION_FAILED: 'Failed to connect to Salesforce',

  // Key Vault
  KV_SECRET_RETRIEVED: 'Secret retrieved successfully',
  KV_SECRET_NOT_FOUND: 'Secret not found in Key Vault',
  KV_ACCESS_DENIED: 'Access denied to Key Vault',

  // Validation
  VALIDATION_FAILED: 'Validation failed',
  REQUIRED_FIELD: 'This field is required',
  INVALID_FORMAT: 'Invalid format',

  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
  OPERATION_FAILED: 'Operation failed',
  INTERNAL_ERROR: 'An internal error occurred',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
} as const;

export type Message = (typeof Messages)[keyof typeof Messages];
