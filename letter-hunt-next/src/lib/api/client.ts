// Credentialed typed fetch wrapper.
//
// Every request is sent with `credentials: 'include'` so the backend's
// httpOnly session cookie is attached automatically. Non-2xx responses
// are normalized into `ApiError`.

import { ApiError, normalizeErrorResponse, UNKNOWN_ERROR_MESSAGE, type ApiErrorBody } from "@/lib/api/errors";

/** Base URL for the backend API, configured via env. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface ApiClientOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable request body. Automatically stringified. */
  body?: unknown;
}

function buildUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Issues a credentialed JSON request against the backend API.
 *
 * @throws {ApiError} when the response status is not in the 2xx range,
 * or when the request fails before a response is received.
 */
export async function apiClient<TResponse = unknown>(
  path: string,
  init: ApiClientOptions = {},
): Promise<TResponse> {
  const { body, headers, ...rest } = init;

  const requestInit: RequestInit = {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let response: Response;
  try {
    response = await fetch(buildUrl(path), requestInit);
  } catch {
    throw new ApiError(0, UNKNOWN_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const errorBody = (await parseJson(response)) as ApiErrorBody | undefined;
    throw normalizeErrorResponse(response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await parseJson(response)) as TResponse;
}
