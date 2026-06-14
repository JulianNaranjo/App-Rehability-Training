// Interim local DTOs for the backend API contract.
//
// These shapes are defined locally until the backend publishes its
// OpenAPI spec. They are isolated in this module so a future swap to
// generated types (e.g. via openapi-typescript) does not require
// changes at call sites — only the source of these types changes.

import type { GameSettings, GameStats, LeaderboardEntry } from "@/types/game";

// --- Auth ---

export interface AuthUserDto {
  id: string;
  email: string;
  displayName: string;
  role: "patient" | "therapist";
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  displayName: string;
}

export type AuthResponseDto = AuthUserDto;

export type MeResponseDto = AuthUserDto;

// --- Scores / Leaderboard ---

export interface SubmitScoreRequestDto {
  score: number;
  time: number;
  level: number;
}

export type SubmitScoreResponseDto = LeaderboardEntry;

export type LeaderboardResponseDto = LeaderboardEntry[];

// --- Stats ---

export type SaveStatsRequestDto = GameStats;

export type LoadStatsResponseDto = GameStats;

// --- Settings ---

export type SaveSettingsRequestDto = GameSettings;

export type LoadSettingsResponseDto = GameSettings;
