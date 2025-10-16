// src/infrastructure/azure/secrets.service.ts
import { config } from '../../config/app.config';
import { getSecretValue } from './key-vault.client';

let cachedSalesforcePrivateKeyPem: string | null = null;

/**
 * Returns the PEM private key for signing Salesforce JWT,
 * retrieved from Key Vault and cached in memory.
 *
 * @returns The private key in PEM format
 * @throws KeyVaultError if retrieval fails
 */
export async function getSalesforcePrivateKeyPem(): Promise<string> {
  if (cachedSalesforcePrivateKeyPem) return cachedSalesforcePrivateKeyPem;
  const pem = await getSecretValue(config.keyVault.privateKeySecretName);
  cachedSalesforcePrivateKeyPem = pem;
  return pem;
}
