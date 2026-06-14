// User settings API service.
//
// Typed endpoint functions for loading and persisting user settings,
// layered on top of `apiClient`.

import { apiClient } from "@/lib/api/client";
import type { LoadSettingsResponseDto, SaveSettingsRequestDto } from "@/lib/api/dtos";

/** Returns the persisted settings for the current user. */
export function getSettings(): Promise<LoadSettingsResponseDto> {
  return apiClient<LoadSettingsResponseDto>("/settings");
}

/** Persists the user's settings. Resolves once the server confirms the write. */
export function saveSettings(body: SaveSettingsRequestDto): Promise<void> {
  return apiClient<void>("/settings", {
    method: "POST",
    body,
  });
}
