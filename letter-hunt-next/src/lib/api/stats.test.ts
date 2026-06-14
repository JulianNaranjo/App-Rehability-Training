import { describe, expect, it } from "vitest";

import { getStats, saveStats } from "@/lib/api/stats";
import { mockStats, unauthorizedHandlers } from "@/lib/api/__mocks__/handlers";
import { server } from "@/lib/api/__mocks__/server";
import { isUnauthorized } from "@/lib/api/errors";

describe("stats service", () => {
  describe("getStats", () => {
    it("returns the aggregated player stats", async () => {
      const stats = await getStats();

      expect(stats).toEqual(mockStats);
    });

    it("throws an unauthorized ApiError when the session is invalid", async () => {
      server.use(...unauthorizedHandlers);

      let error: unknown;

      try {
        await getStats();
      } catch (caught) {
        error = caught;
      }

      expect(isUnauthorized(error)).toBe(true);
    });
  });

  describe("saveStats", () => {
    it("resolves with no content on success", async () => {
      await expect(saveStats(mockStats)).resolves.toBeUndefined();
    });
  });
});
