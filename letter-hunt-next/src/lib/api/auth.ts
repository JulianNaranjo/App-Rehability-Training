// Auth API service.
//
// Typed endpoint functions for the authentication routes, layered on
// top of `apiClient`. Call sites depend on these functions and the
// `*Dto` contracts rather than on raw fetch calls or route strings.

import { apiClient } from "@/lib/api/client";
import type {
  AuthResponseDto,
  LoginRequestDto,
  MeResponseDto,
  RegisterRequestDto,
} from "@/lib/api/dtos";

/** Authenticates a user with email + password and establishes a session. */
export function login(body: LoginRequestDto): Promise<AuthResponseDto> {
  return apiClient<AuthResponseDto>("/auth/login", {
    method: "POST",
    body,
  });
}

/** Registers a new user account and establishes a session. */
export function register(body: RegisterRequestDto): Promise<AuthResponseDto> {
  return apiClient<AuthResponseDto>("/auth/register", {
    method: "POST",
    body,
  });
}

/**
 * Returns the user tied to the current session.
 *
 * @throws {ApiError} with status 401 when the session is missing or expired.
 */
export function getCurrentUser(): Promise<MeResponseDto> {
  return apiClient<MeResponseDto>("/auth/me");
}

/** Clears the backend session. Resolves once the server confirms logout. */
export function logout(): Promise<void> {
  return apiClient<void>("/auth/logout", { method: "POST" });
}
