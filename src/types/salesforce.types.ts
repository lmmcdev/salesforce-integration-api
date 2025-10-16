// src/types/salesforce.types.ts

/**
 * JWT payload structure for Salesforce authentication
 */
export interface SalesforceJwtPayload {
  iss: string; // Client ID
  sub: string; // Username
  aud: string; // Login URL
  exp: number; // Expiration time (in seconds since epoch)
}

/**
 * Response structure from Salesforce OAuth2 token endpoint
 */
export interface SalesforceAuthResponse {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
}

/**
 * Salesforce environment types
 */
export type SalesforceEnvironment = 'production' | 'sandbox';

/**
 * Configuration for Salesforce connection
 */
export interface SalesforceConfig {
  environment: SalesforceEnvironment;
  clientId: string;
  username: string;
  loginUrl: string;
  apiVersion: string;
}
