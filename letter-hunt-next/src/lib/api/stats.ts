// Player stats API service.
//
// Typed endpoint functions for loading and persisting aggregated
// player statistics, layered on top of `apiClient`.

import { apiClient } from "@/lib/api/client";
import type { LoadStatsResponseDto, SaveStatsRequestDto } from "@/lib/api/dtos";

/** Returns the aggregated stats for the current player. */
export function getStats(): Promise<LoadStatsResponseDto> {
  return apiClient<LoadStatsResponseDto>("/stats");
}

/** Persists the player's stats. Resolves once the server confirms the write. */
export function saveStats(body: SaveStatsRequestDto): Promise<void> {
  return apiClient<void>("/stats", {
    method: "POST",
    body,
  });
}
