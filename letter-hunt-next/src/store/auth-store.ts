"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "@/lib/api/auth";
import { ApiError, isUnauthorized, UNKNOWN_ERROR_MESSAGE } from "@/lib/api/errors";
import type { AuthStore } from "@/types/auth";

/** Maps an unknown error caught from the auth API to a user-facing message. */
function toMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return UNKNOWN_ERROR_MESSAGE;
}

const initialState = {
  user: null,
  status: "idle" as const,
  error: undefined,
};

/**
 * Client-side session store.
 *
 * Wraps `src/lib/api/auth.ts`, normalizing results into `AuthState`.
 * No `persist` middleware: the session lives in a httpOnly cookie owned
 * by the backend, so `fetchCurrentUser` re-derives the truth on every
 * load instead of caching `user` locally.
 */
export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    fetchCurrentUser: async () => {
      set({ status: "loading", error: undefined });

      try {
        const user = await getCurrentUser();
        set({ user, status: "authenticated", error: undefined });
      } catch (error) {
        if (isUnauthorized(error)) {
          set({ user: null, status: "unauthenticated", error: undefined });
          return;
        }

        set({ user: null, status: "error", error: toMessage(error) });
      }
    },

    login: async (body) => {
      set({ status: "loading", error: undefined });

      try {
        const user = await loginApi(body);
        set({ user, status: "authenticated", error: undefined });
        return true;
      } catch (error) {
        set({ user: null, status: "error", error: toMessage(error) });
        return false;
      }
    },

    register: async (body) => {
      set({ status: "loading", error: undefined });

      try {
        const user = await registerApi(body);
        set({ user, status: "authenticated", error: undefined });
        return true;
      } catch (error) {
        set({ user: null, status: "error", error: toMessage(error) });
        return false;
      }
    },

    logout: async () => {
      try {
        await logoutApi();
      } catch {
        // Clear local session state regardless of API outcome.
      }

      set({ user: null, status: "unauthenticated", error: undefined });
    },
  })),
);
