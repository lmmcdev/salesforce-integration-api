import axios from 'axios';
import type { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';
import { getSalesforcePrivateKeyPem } from '../infrastructure/azure/secrets.service';
import type { SalesforceJwtPayload, SalesforceAuthResponse } from '../types';
import { AuthenticationError, SalesforceError } from '../utils/errors';

export class SalesforceJwtAuth {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private instanceUrl: string | null = null;

  constructor() {
    const instance: AxiosInstance = axios.create({
      baseURL: config.salesforce.loginUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    this.axiosInstance = instance;
  }

  private async createJwt(): Promise<string> {
    const privateKeyPem = await getSalesforcePrivateKeyPem();
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const payload: SalesforceJwtPayload = {
      iss: config.salesforce.clientId,
      sub: config.salesforce.username,
      aud: config.salesforce.loginUrl,
      exp: nowInSeconds + 300, // Token valid for 5 minutes
    };

    return jwt.sign(payload, privateKeyPem, { algorithm: 'RS256' });
  }

  public async authenticate(): Promise<void> {
    const jwtToken = await this.createJwt();
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    params.append('assertion', jwtToken);

    try {
      const response = await this.axiosInstance.post<SalesforceAuthResponse>('/services/oauth2/token', params);
      this.accessToken = response.data.access_token;
      this.instanceUrl = response.data.instance_url;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new SalesforceError(
          `Salesforce authentication failed: ${error.response.status} ${error.response.statusText}`,
          error.response.status,
          error.response.data
        );
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new AuthenticationError(`Salesforce authentication failed: ${errorMessage}`);
    }
  }

  public getAccessToken(): string {
    if (!this.accessToken) {
      throw new AuthenticationError('Not authenticated. Call authenticate() first.');
    }
    return this.accessToken;
  }

  public getInstanceUrl(): string {
    if (!this.instanceUrl) {
      throw new AuthenticationError('Not authenticated. Call authenticate() first.');
    }
    return this.instanceUrl;
  }
}

// Example usage:
// const salesforceAuth = new SalesforceJwtAuth();
// await salesforceAuth.authenticate();
// const accessToken = salesforceAuth.getAccessToken();
// const instanceUrl = salesforceAuth.getInstanceUrl();
