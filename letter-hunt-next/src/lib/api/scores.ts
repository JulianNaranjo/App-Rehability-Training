// Scores & leaderboard API service.
//
// Typed endpoint functions for score submission and leaderboard
// retrieval, layered on top of `apiClient`.

import { apiClient } from "@/lib/api/client";
import type {
  LeaderboardResponseDto,
  SubmitScoreRequestDto,
  SubmitScoreResponseDto,
} from "@/lib/api/dtos";

/** Submits a completed-game score and returns the persisted leaderboard entry. */
export function submitScore(body: SubmitScoreRequestDto): Promise<SubmitScoreResponseDto> {
  return apiClient<SubmitScoreResponseDto>("/scores", {
    method: "POST",
    body,
  });
}

/** Returns the leaderboard entries, ordered by the backend. */
export function getLeaderboard(): Promise<LeaderboardResponseDto> {
  return apiClient<LeaderboardResponseDto>("/leaderboard");
}
