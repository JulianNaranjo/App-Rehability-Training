import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/lib/api/__mocks__/server";
import { apiClient, API_BASE_URL } from "@/lib/api/client";
import { ApiError, isUnauthorized } from "@/lib/api/errors";

describe("apiClient", () => {
  it("sends credentials: 'include' and resolves the JSON body on success", async () => {
    let capturedCredentials: RequestCredentials | undefined;

    server.use(
      http.get(`${API_BASE_URL}/ping`, ({ request }) => {
        capturedCredentials = request.credentials;
        return HttpResponse.json({ ok: true }, { status: 200 });
      }),
    );

    const result = await apiClient<{ ok: boolean }>("/ping");

    expect(result).toEqual({ ok: true });
    expect(capturedCredentials).toBe("include");
  });

  it("throws a normalized ApiError on a non-2xx response", async () => {
    server.use(
      http.get(`${API_BASE_URL}/broken`, () => {
        return HttpResponse.json(
          { message: "Resource not found.", code: "NOT_FOUND" },
          { status: 404 },
        );
      }),
    );

    await expect(apiClient("/broken")).rejects.toMatchObject({
      status: 404,
      message: "Resource not found.",
      code: "NOT_FOUND",
    });
  });

  it("distinguishes 401 (unauthorized) from other errors via isUnauthorized", async () => {
    server.use(
      http.get(`${API_BASE_URL}/secure`, () => {
        return HttpResponse.json({ message: "Session expired." }, { status: 401 });
      }),
      http.get(`${API_BASE_URL}/conflict`, () => {
        return HttpResponse.json({ message: "Conflict." }, { status: 409 });
      }),
    );

    let unauthorizedError: unknown;
    let conflictError: unknown;

    try {
      await apiClient("/secure");
    } catch (error) {
      unauthorizedError = error;
    }

    try {
      await apiClient("/conflict");
    } catch (error) {
      conflictError = error;
    }

    expect(unauthorizedError).toBeInstanceOf(ApiError);
    expect(isUnauthorized(unauthorizedError)).toBe(true);

    expect(conflictError).toBeInstanceOf(ApiError);
    expect(isUnauthorized(conflictError)).toBe(false);
  });

  it("returns undefined for 204 No Content responses", async () => {
    server.use(
      http.post(`${API_BASE_URL}/no-content`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const result = await apiClient("/no-content", { method: "POST" });

    expect(result).toBeUndefined();
  });
});
