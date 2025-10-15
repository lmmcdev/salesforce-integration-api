import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export function health(_request: HttpRequest, context: InvocationContext): HttpResponseInit {
  context.log('Health check endpoint called');

  return {
    status: 200,
    jsonBody: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'salesforce-integration-api',
      version: '1.0.0',
    },
  };
}

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: health,
});
