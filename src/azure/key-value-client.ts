// src/azure/key-value-client.ts
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential, ClientSecretCredential, TokenCredential } from '@azure/identity';
import { config } from '../config/app.config';

/**
 * Builds the appropriate Azure credential based on configuration.
 * Uses ClientSecretCredential if all SP credentials are provided,
 * otherwise falls back to DefaultAzureCredential (Managed Identity).
 */
function buildCredential(): TokenCredential {
  const { tenantId, clientId, clientSecret } = config.azureIdentity;
  if (tenantId && clientId && clientSecret) {
    console.log('Using Azure Service Principal authentication');
    return new ClientSecretCredential(tenantId, clientId, clientSecret);
  }
  console.log('Using DefaultAzureCredential (Managed Identity or Azure CLI)');
  return new DefaultAzureCredential();
}

const credential = buildCredential();

export const secretClient = new SecretClient(config.keyVault.url, credential);

/**
 * Retrieves the latest version of a secret from Azure Key Vault.
 * @param secretName - The name of the secret to retrieve
 * @returns The secret value as a string
 * @throws Error if the secret is not found, empty, or retrieval fails
 */
export async function getSecretValue(secretName: string): Promise<string> {
  if (!secretName.trim()) {
    throw new Error('Secret name cannot be empty');
  }

  try {
    const resp = await secretClient.getSecret(secretName);
    if (!resp.value) {
      throw new Error(`Key Vault: secret "${secretName}" exists but has no value`);
    }
    return resp.value;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with additional context if it's already an Error
      throw new Error(`Failed to retrieve secret "${secretName}" from Key Vault: ${error.message}`);
    }
    throw new Error(`Failed to retrieve secret "${secretName}" from Key Vault`);
  }
}
