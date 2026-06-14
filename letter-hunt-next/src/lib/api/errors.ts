// Normalized API error types and helpers.
//
// All non-2xx responses from the backend are converted into `ApiError`
// instances so callers can branch on `status`/`code` instead of parsing
// raw `Response` objects.

export interface ApiErrorBody {
  message?: string;
  code?: string;
}

/**
 * Normalized error thrown by `apiClient` for non-2xx responses
 * and network failures.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** Generic message shown to users on authentication failures. */
export const UNAUTHORIZED_MESSAGE = "Invalid email or password.";

/** Generic message shown to users on unexpected/network failures. */
export const UNKNOWN_ERROR_MESSAGE = "Something went wrong. Please try again.";

/**
 * Type guard distinguishing an unauthenticated (401) response from
 * any other API error.
 */
export function isUnauthorized(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401;
}

/**
 * Builds an `ApiError` from a `Response` and its parsed JSON body
 * (if any). Falls back to generic messages when the body does not
 * provide one.
 */
export function normalizeErrorResponse(
  status: number,
  body: ApiErrorBody | undefined,
): ApiError {
  if (status === 401) {
    return new ApiError(status, body?.message ?? UNAUTHORIZED_MESSAGE, body?.code);
  }

  return new ApiError(status, body?.message ?? UNKNOWN_ERROR_MESSAGE, body?.code);
}
