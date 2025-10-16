// src/config/config.ts
import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    // Salesforce (JWT Bearer)
    SF_ENV: z.enum(['production', 'sandbox']).default('production'),
    SF_CLIENT_ID: z.string().min(1, 'SF_CLIENT_ID is required'),
    SF_USERNAME: z.string().min(1, 'SF_USERNAME (the user to impersonate) is required'),

    // Azure Key Vault (Secret with the PEM private key)
    AZURE_KEY_VAULT_NAME: z.string().min(1, 'AZURE_KEY_VAULT_NAME is required'),
    SF_JWT_PRIVATE_KEY_SECRET_NAME: z.string().default('sf-jwt-private-key'),

    // Optional: explicit API version (defaults to v60.0)
    SF_API_VERSION: z.string().default('v60.0'),

    // Optional Azure Service Principal creds (if not using Managed Identity)
    AZURE_TENANT_ID: z.string().optional(),
    AZURE_CLIENT_ID: z.string().optional(),
    AZURE_CLIENT_SECRET: z.string().optional(),
  })
  .superRefine((vals, ctx) => {
    const anySp = !!vals.AZURE_TENANT_ID || !!vals.AZURE_CLIENT_ID || !!vals.AZURE_CLIENT_SECRET;
    const allSp = !!vals.AZURE_TENANT_ID && !!vals.AZURE_CLIENT_ID && !!vals.AZURE_CLIENT_SECRET;

    if (anySp && !allSp) {
      ctx.addIssue({
        code: 'custom',
        message:
          'If using Azure Service Principal, you must set AZURE_TENANT_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET together. Otherwise leave all three unset to use Managed Identity/DefaultAzureCredential.',
        path: ['AZURE_CLIENT_ID'],
      });
    }
  });

const env = EnvSchema.parse(process.env);

const loginUrl = env.SF_ENV === 'sandbox' ? 'https://test.salesforce.com' : 'https://login.salesforce.com';

export const cfg = {
  nodeEnv: env.NODE_ENV,

  salesforce: {
    environment: env.SF_ENV,
    clientId: env.SF_CLIENT_ID,
    username: env.SF_USERNAME,
    loginUrl,
    apiVersion: env.SF_API_VERSION, // e.g. 'v60.0'
  },

  keyVault: {
    name: env.AZURE_KEY_VAULT_NAME,
    url: `https://${env.AZURE_KEY_VAULT_NAME}.vault.azure.net`,
    privateKeySecretName: env.SF_JWT_PRIVATE_KEY_SECRET_NAME, // secret with PEM
  },

  // If all three are provided, your app will use SP creds; otherwise DefaultAzureCredential.
  azureIdentity: {
    tenantId: env.AZURE_TENANT_ID,
    clientId: env.AZURE_CLIENT_ID,
    clientSecret: env.AZURE_CLIENT_SECRET,
  },
} as const;

export type AppConfig = typeof cfg;
