import { describe, expect, it } from "vitest";

import { getLeaderboard, submitScore } from "@/lib/api/scores";
import {
  mockLeaderboard,
  serverErrorHandlers,
  unauthorizedHandlers,
} from "@/lib/api/__mocks__/handlers";
import { server } from "@/lib/api/__mocks__/server";
import { isUnauthorized } from "@/lib/api/errors";

describe("scores service", () => {
  describe("submitScore", () => {
    it("returns the persisted leaderboard entry echoing the submitted score", async () => {
      const entry = await submitScore({ score: 950, time: 40, level: 4 });

      expect(entry).toMatchObject({ score: 950, time: 40, level: 4 });
      expect(entry.id).toBeDefined();
    });

    it("throws a normalized ApiError on a server failure", async () => {
      server.use(...serverErrorHandlers);

      await expect(
        submitScore({ score: 10, time: 5, level: 1 }),
      ).rejects.toMatchObject({ status: 500 });
    });
  });

  describe("getLeaderboard", () => {
    it("returns the leaderboard entries", async () => {
      const entries = await getLeaderboard();

      expect(entries).toEqual(mockLeaderboard);
    });

    it("throws an unauthorized ApiError when the session is invalid", async () => {
      server.use(...unauthorizedHandlers);

      let error: unknown;

      try {
        await getLeaderboard();
      } catch (caught) {
        error = caught;
      }

      expect(isUnauthorized(error)).toBe(true);
    });
  });
});
