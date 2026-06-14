// MSW mock contract for the backend API.
//
// These handlers stand in for the NestJS backend until its OpenAPI
// spec is published. They mirror the routes consumed by
// `src/lib/api/*` and provide both success and error paths so unit
// tests can exercise `ApiError` normalization (e.g. 401 handling).

import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/lib/api/client";
import type {
  AuthUserDto,
  LeaderboardResponseDto,
  LoadSettingsResponseDto,
  LoadStatsResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  SubmitScoreRequestDto,
} from "@/lib/api/dtos";

const url = (path: string) => `${API_BASE_URL}${path}`;

export const mockUser: AuthUserDto = {
  id: "user-1",
  email: "patient@example.com",
  displayName: "Test Patient",
  role: "patient",
};

export const mockStats: LoadStatsResponseDto = {
  gamesPlayed: 5,
  gamesWon: 3,
  bestTime: 42,
  averageTime: 58,
  totalMoves: 120,
  accuracy: 0.8,
};

export const mockSettings: LoadSettingsResponseDto = {
  theme: {
    name: "default",
    colors: {
      primary: "#4f46e5",
      secondary: "#06b6d4",
      accent: "#f59e0b",
      success: "#22c55e",
      error: "#ef4444",
      warning: "#f59e0b",
      background: "#ffffff",
      surface: "#f3f4f6",
      text: "#111827",
    },
    fonts: {
      heading: "sans-serif",
      body: "sans-serif",
      mono: "monospace",
    },
  },
  soundEnabled: true,
  animationsEnabled: true,
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    keyboardOnly: false,
    fontSize: "medium",
  },
  autoSave: true,
  showHints: true,
};

export const mockLeaderboard: LeaderboardResponseDto = [
  { id: "entry-1", playerName: "Alice", score: 980, time: 35, level: 3, date: "2026-06-01" },
  { id: "entry-2", playerName: "Bob", score: 870, time: 48, level: 2, date: "2026-06-02" },
];

export const handlers = [
  http.post(url("/auth/login"), async ({ request }) => {
    const body = (await request.json()) as LoginRequestDto;

    if (body.email === mockUser.email && body.password === "correct-password") {
      return HttpResponse.json(mockUser, { status: 200 });
    }

    return HttpResponse.json(
      { message: "Invalid email or password.", code: "INVALID_CREDENTIALS" },
      { status: 401 },
    );
  }),

  http.post(url("/auth/register"), async ({ request }) => {
    const body = (await request.json()) as RegisterRequestDto;

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: "Email and password are required.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      { ...mockUser, email: body.email, displayName: body.displayName },
      { status: 201 },
    );
  }),

  http.get(url("/auth/me"), () => {
    return HttpResponse.json(mockUser, { status: 200 });
  }),

  http.post(url("/auth/logout"), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(url("/scores"), async ({ request }) => {
    const body = (await request.json()) as SubmitScoreRequestDto;

    return HttpResponse.json(
      {
        id: "entry-new",
        playerName: mockUser.displayName,
        score: body.score,
        time: body.time,
        level: body.level,
        date: "2026-06-13",
      },
      { status: 201 },
    );
  }),

  http.get(url("/leaderboard"), () => {
    return HttpResponse.json(mockLeaderboard, { status: 200 });
  }),

  http.get(url("/stats"), () => {
    return HttpResponse.json(mockStats, { status: 200 });
  }),

  http.post(url("/stats"), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(url("/settings"), () => {
    return HttpResponse.json(mockSettings, { status: 200 });
  }),

  http.post(url("/settings"), () => {
    return new HttpResponse(null, { status: 204 });
  }),
];

/** 401 variants for endpoints reusable across tests that exercise auth gating. */
export const unauthorizedHandlers = [
  http.get(url("/auth/me"), () => {
    return HttpResponse.json(
      { message: "Session expired.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }),
  http.get(url("/leaderboard"), () => {
    return HttpResponse.json(
      { message: "Session expired.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }),
  http.get(url("/stats"), () => {
    return HttpResponse.json(
      { message: "Session expired.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }),
];

/** Generic 500 handlers for testing non-401 error normalization. */
export const serverErrorHandlers = [
  http.get(url("/leaderboard"), () => {
    return HttpResponse.json({ message: "Internal error.", code: "INTERNAL" }, { status: 500 });
  }),
  http.post(url("/scores"), () => {
    return HttpResponse.json({ message: "Internal error.", code: "INTERNAL" }, { status: 500 });
  }),
];
