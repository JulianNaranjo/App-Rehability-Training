import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { mockUser, unauthorizedHandlers } from "@/lib/api/__mocks__/handlers";
import { server } from "@/lib/api/__mocks__/server";
import { API_BASE_URL } from "@/lib/api/client";
import { UNAUTHORIZED_MESSAGE, UNKNOWN_ERROR_MESSAGE } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth-store";

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

describe("useAuthStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("has the expected initial state", () => {
    const state = useAuthStore.getState();

    expect(state.status).toBe("idle");
    expect(state.user).toBeNull();
    expect(state.error).toBeUndefined();
  });

  describe("fetchCurrentUser", () => {
    it("sets status to authenticated and stores the user on success", async () => {
      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.status).toBe("authenticated");
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeUndefined();
    });

    it("sets status to unauthenticated without an error on 401", async () => {
      server.use(...unauthorizedHandlers);

      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.status).toBe("unauthenticated");
      expect(state.user).toBeNull();
      expect(state.error).toBeUndefined();
    });

    it("sets status to error with a message on a non-401 failure", async () => {
      server.use(
        http.get(`${API_BASE_URL}/auth/me`, () => {
          return HttpResponse.json(
            { message: "Internal error.", code: "INTERNAL" },
            { status: 500 },
          );
        }),
      );

      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.status).toBe("error");
      expect(state.user).toBeNull();
      expect(state.error).toBe("Internal error.");
    });
  });

  describe("login", () => {
    it("transitions to authenticated and stores the user on success", async () => {
      const result = await useAuthStore
        .getState()
        .login({ email: mockUser.email, password: "correct-password" });

      expect(result).toBe(true);
      const state = useAuthStore.getState();
      expect(state.status).toBe("authenticated");
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeUndefined();
    });

    it("returns false and sets UNAUTHORIZED_MESSAGE on invalid credentials", async () => {
      const result = await useAuthStore
        .getState()
        .login({ email: mockUser.email, password: "wrong-password" });

      expect(result).toBe(false);
      const state = useAuthStore.getState();
      expect(state.status).toBe("error");
      expect(state.user).toBeNull();
      expect(state.error).toBe(UNAUTHORIZED_MESSAGE);
    });

    it("sets status to loading while the request is in flight", async () => {
      const promise = useAuthStore
        .getState()
        .login({ email: mockUser.email, password: "correct-password" });

      expect(useAuthStore.getState().status).toBe("loading");

      await promise;
    });

    it("returns false and sets a generic message on a network/unknown error", async () => {
      server.use(
        http.post(`${API_BASE_URL}/auth/login`, () => {
          return HttpResponse.error();
        }),
      );

      const result = await useAuthStore
        .getState()
        .login({ email: mockUser.email, password: "correct-password" });

      expect(result).toBe(false);
      const state = useAuthStore.getState();
      expect(state.status).toBe("error");
      expect(state.error).toBe(UNKNOWN_ERROR_MESSAGE);
    });
  });

  describe("register", () => {
    it("transitions to authenticated and stores the user on success", async () => {
      const result = await useAuthStore.getState().register({
        email: "new@example.com",
        password: "secret-password",
        displayName: "New User",
      });

      expect(result).toBe(true);
      const state = useAuthStore.getState();
      expect(state.status).toBe("authenticated");
      expect(state.user).toMatchObject({
        email: "new@example.com",
        displayName: "New User",
      });
      expect(state.error).toBeUndefined();
    });

    it("returns false and sets the API error message on a validation error", async () => {
      const result = await useAuthStore.getState().register({
        email: "",
        password: "",
        displayName: "",
      });

      expect(result).toBe(false);
      const state = useAuthStore.getState();
      expect(state.status).toBe("error");
      expect(state.user).toBeNull();
      expect(state.error).toBe("Email and password are required.");
    });
  });

  describe("logout", () => {
    it("clears local state and sets status to unauthenticated on success", async () => {
      useAuthStore.setState({ user: mockUser, status: "authenticated", error: undefined });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.status).toBe("unauthenticated");
      expect(state.error).toBeUndefined();
    });

    it("clears local state even if the logout API call fails", async () => {
      server.use(
        http.post(`${API_BASE_URL}/auth/logout`, () => {
          return HttpResponse.json({ message: "Server error." }, { status: 500 });
        }),
      );
      useAuthStore.setState({ user: mockUser, status: "authenticated", error: undefined });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.status).toBe("unauthenticated");
      expect(state.error).toBeUndefined();
    });
  });
});
