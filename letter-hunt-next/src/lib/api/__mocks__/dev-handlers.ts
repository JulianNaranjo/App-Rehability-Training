// Stateful MSW handlers for LOCAL DEVELOPMENT only.
//
// Unlike the test handlers (./handlers.ts) — which are stateless so each
// test can control the response — these keep an in-memory session and user
// registry so the auth flow behaves realistically in the browser:
// you start logged out (`/auth/me` -> 401), register/login authenticates
// you, and logout clears the session. State is lost when the dev server
// restarts (in-memory only); this is a stand-in until the real backend exists.

import { http, HttpResponse } from "msw";

import { mockLeaderboard, mockSettings, mockStats } from "@/lib/api/__mocks__/handlers";
import { API_BASE_URL } from "@/lib/api/client";
import type {
  AuthUserDto,
  LoginRequestDto,
  RegisterRequestDto,
  SubmitScoreRequestDto,
} from "@/lib/api/dtos";

const url = (path: string) => `${API_BASE_URL}${path}`;

interface StoredUser {
  password: string;
  user: AuthUserDto;
}

// In-memory dev state (resets when the dev server restarts).
const users = new Map<string, StoredUser>();
let session: AuthUserDto | null = null;
let nextId = 1;

// --- DEV-ONLY SEED ---------------------------------------------------------
// Pre-populated account so login works immediately after every `next dev`
// restart without re-registering. Credentials are intentionally hardcoded
// (dev-only file, never shipped). REMOVE this block when a real backend lands.
const SEED_USER: StoredUser = {
  password: "devpassword",
  user: {
    id: "user-seed",
    email: "dev@letter-hunt.local",
    displayName: "Dev User",
    role: "patient",
  },
};
users.set(SEED_USER.user.email, SEED_USER);
// --------------------------------------------------------------------------

const unauthorized = () =>
  HttpResponse.json({ message: "Session expired.", code: "UNAUTHORIZED" }, { status: 401 });

export const devHandlers = [
  http.post(url("/auth/register"), async ({ request }) => {
    const body = (await request.json()) as RegisterRequestDto;

    if (!body.email || !body.password || !body.displayName) {
      return HttpResponse.json(
        { message: "Todos los campos son obligatorios.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (users.has(body.email)) {
      return HttpResponse.json(
        { message: "Ese correo ya está registrado.", code: "EMAIL_TAKEN" },
        { status: 409 },
      );
    }

    const user: AuthUserDto = {
      id: `user-${nextId++}`,
      email: body.email,
      displayName: body.displayName,
      role: "patient",
    };
    users.set(body.email, { password: body.password, user });
    session = user;

    return HttpResponse.json(user, { status: 201 });
  }),

  http.post(url("/auth/login"), async ({ request }) => {
    const body = (await request.json()) as LoginRequestDto;
    const stored = users.get(body.email);

    if (!stored || stored.password !== body.password) {
      return HttpResponse.json(
        { message: "Invalid email or password.", code: "INVALID_CREDENTIALS" },
        { status: 401 },
      );
    }

    session = stored.user;
    return HttpResponse.json(stored.user, { status: 200 });
  }),

  http.get(url("/auth/me"), () =>
    session ? HttpResponse.json(session, { status: 200 }) : unauthorized(),
  ),

  http.post(url("/auth/logout"), () => {
    session = null;
    return new HttpResponse(null, { status: 204 });
  }),

  // Authenticated app data — require a live session, otherwise 401.
  http.get(url("/stats"), () =>
    session ? HttpResponse.json(mockStats, { status: 200 }) : unauthorized(),
  ),
  http.post(url("/stats"), () =>
    session ? new HttpResponse(null, { status: 204 }) : unauthorized(),
  ),
  http.get(url("/settings"), () =>
    session ? HttpResponse.json(mockSettings, { status: 200 }) : unauthorized(),
  ),
  http.post(url("/settings"), () =>
    session ? new HttpResponse(null, { status: 204 }) : unauthorized(),
  ),
  http.get(url("/leaderboard"), () =>
    session ? HttpResponse.json(mockLeaderboard, { status: 200 }) : unauthorized(),
  ),
  http.post(url("/scores"), async ({ request }) => {
    if (!session) {
      return unauthorized();
    }

    const body = (await request.json()) as SubmitScoreRequestDto;
    return HttpResponse.json(
      {
        id: `entry-${nextId++}`,
        playerName: session.displayName,
        score: body.score,
        time: body.time,
        level: body.level,
        date: new Date().toISOString().slice(0, 10),
      },
      { status: 201 },
    );
  }),
];
