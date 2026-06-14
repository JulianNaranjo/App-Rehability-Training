// Auth store types.
//
// Shapes the client-side session state derived from the existing
// `src/lib/api/auth.ts` service layer. The user shape itself is
// reused from `AuthUserDto` (see `src/lib/api/dtos.ts`) rather than
// redefined here.

import type {
  AuthUserDto,
  LoginRequestDto,
  RegisterRequestDto,
} from "@/lib/api/dtos";

/**
 * Lifecycle of the client-side auth session.
 *
 * - `idle`: before bootstrap has run.
 * - `loading`: bootstrap or a login/register request is in flight.
 * - `authenticated`: a valid session/user is present.
 * - `unauthenticated`: no valid session (includes the normal 401 on `/auth/me`).
 * - `error`: an unexpected (non-401) failure occurred.
 */
export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export interface AuthState {
  user: AuthUserDto | null;
  status: AuthStatus;
  /** User-facing message, only set on `'error'` or a failed login/register. */
  error?: string;
}

export interface AuthActions {
  /** Returns `true` on success so the caller can decide navigation. */
  login: (body: LoginRequestDto) => Promise<boolean>;
  /** Returns `true` on success so the caller can decide navigation. */
  register: (body: RegisterRequestDto) => Promise<boolean>;
  /** Clears local session state even if the API call fails. */
  logout: () => Promise<void>;
  /** Bootstraps the session from the httpOnly cookie. Never throws. */
  fetchCurrentUser: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;
