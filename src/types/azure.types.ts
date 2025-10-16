// src/types/azure.types.ts

/**
 * Azure Key Vault configuration
 */
export interface KeyVaultConfig {
  name: string;
  url: string;
  privateKeySecretName: string;
}

/**
 * Azure Service Principal credentials
 */
export interface AzureIdentityConfig {
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
}
