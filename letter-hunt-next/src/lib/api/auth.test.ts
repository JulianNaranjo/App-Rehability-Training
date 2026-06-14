import { describe, expect, it } from "vitest";

import { getCurrentUser, login, logout, register } from "@/lib/api/auth";
import { mockUser, unauthorizedHandlers } from "@/lib/api/__mocks__/handlers";
import { server } from "@/lib/api/__mocks__/server";
import { isUnauthorized } from "@/lib/api/errors";

describe("auth service", () => {
  describe("login", () => {
    it("returns the authenticated user on valid credentials", async () => {
      const user = await login({ email: mockUser.email, password: "correct-password" });

      expect(user).toEqual(mockUser);
    });

    it("throws an unauthorized ApiError on invalid credentials", async () => {
      let error: unknown;

      try {
        await login({ email: mockUser.email, password: "wrong-password" });
      } catch (caught) {
        error = caught;
      }

      expect(isUnauthorized(error)).toBe(true);
      expect(error).toMatchObject({ status: 401, code: "INVALID_CREDENTIALS" });
    });
  });

  describe("register", () => {
    it("creates and returns a user reflecting the submitted email and displayName", async () => {
      const user = await register({
        email: "new@example.com",
        password: "secret-password",
        displayName: "New User",
      });

      expect(user).toMatchObject({ email: "new@example.com", displayName: "New User" });
    });

    it("throws a validation ApiError when required fields are missing", async () => {
      await expect(
        register({ email: "", password: "", displayName: "" }),
      ).rejects.toMatchObject({ status: 400, code: "VALIDATION_ERROR" });
    });
  });

  describe("getCurrentUser", () => {
    it("returns the user tied to the current session", async () => {
      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    it("throws an unauthorized ApiError when the session is invalid", async () => {
      server.use(...unauthorizedHandlers);

      let error: unknown;

      try {
        await getCurrentUser();
      } catch (caught) {
        error = caught;
      }

      expect(isUnauthorized(error)).toBe(true);
    });
  });

  describe("logout", () => {
    it("resolves with no content on success", async () => {
      await expect(logout()).resolves.toBeUndefined();
    });
  });
});
