// src/middlewares/error-handler.ts
import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { formatError } from '../utils/errors';

/**
 * Error handler middleware for Azure Functions
 * Catches errors and returns formatted HTTP responses
 */
export function errorHandler(
  handler: (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>
): (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit> {
  return async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      return await handler(request, context);
    } catch (error) {
      const formattedError = formatError(error);

      context.error(`Error occurred: ${formattedError.message}`, {
        code: formattedError.code,
        statusCode: formattedError.statusCode,
        details: formattedError.details,
      });

      const errorResponse: Record<string, unknown> = {
        message: formattedError.message,
        code: formattedError.code,
      };

      if (formattedError.details) {
        errorResponse.details = formattedError.details;
      }

      return {
        status: formattedError.statusCode,
        jsonBody: {
          error: errorResponse,
        },
      };
    }
  };
}

/**
 * Wraps an async function with error handling
 * Useful for non-HTTP handler functions
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: InvocationContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const formattedError = formatError(error);

    if (context) {
      context.error(`Error in operation: ${formattedError.message}`, {
        code: formattedError.code,
        details: formattedError.details,
      });
    }

    throw error;
  }
}
