import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { getSettings, saveSettings } from "@/lib/api/settings";
import { API_BASE_URL } from "@/lib/api/client";
import { mockSettings } from "@/lib/api/__mocks__/handlers";
import { server } from "@/lib/api/__mocks__/server";

describe("settings service", () => {
  describe("getSettings", () => {
    it("returns the persisted user settings", async () => {
      const settings = await getSettings();

      expect(settings).toEqual(mockSettings);
    });

    it("throws a normalized ApiError on a server failure", async () => {
      server.use(
        http.get(`${API_BASE_URL}/settings`, () =>
          HttpResponse.json({ message: "Internal error." }, { status: 500 }),
        ),
      );

      await expect(getSettings()).rejects.toMatchObject({ status: 500 });
    });
  });

  describe("saveSettings", () => {
    it("resolves with no content on success", async () => {
      await expect(saveSettings(mockSettings)).resolves.toBeUndefined();
    });
  });
});
