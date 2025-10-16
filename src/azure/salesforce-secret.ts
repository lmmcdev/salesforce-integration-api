// src/azure/salesforce-secret.ts
import { config } from '../config/app.config';
import { getSecretValue } from './key-value-client';

let cachedSalesforcePrivateKeyPem: string | null = null;

/**
 * Devuelve el PEM de la clave privada para firmar el JWT de Salesforce,
 * leído desde Key Vault (y cacheado en memoria).
 */
export async function getSalesforcePrivateKeyPem(): Promise<string> {
  if (cachedSalesforcePrivateKeyPem) return cachedSalesforcePrivateKeyPem;
  const pem = await getSecretValue(config.keyVault.privateKeySecretName);
  cachedSalesforcePrivateKeyPem = pem;
  return pem;
}
