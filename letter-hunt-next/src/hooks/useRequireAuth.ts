"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";
import type { AuthStatus } from "@/types/auth";

interface RequireAuthGate {
  /** The raw `useAuthStore` status. */
  status: AuthStatus;
  /** Re-invokes the session fetch (bound to `fetchCurrentUser`). */
  retry: () => void;
}

/**
 * Logic hook for the `<RequireAuth>` guard.
 *
 * Reads the current session status and redirects to `/auth/login`
 * (via `router.replace`) once the status resolves to
 * `'unauthenticated'`. The redirect runs as a `useEffect` side effect
 * (never during render). Renders no UI — see `<RequireAuth>` for the
 * render contract.
 */
export function useRequireAuth(): RequireAuthGate {
  const status = useAuthStore((state) => state.status);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
    // `router` is intentionally omitted: `useRouter()` may return a new
    // object reference per render, and the redirect must fire exactly
    // once per resolved `status` transition (spec AC7), not on every
    // re-render of an already-unauthenticated status.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const retry = useCallback(() => {
    void fetchCurrentUser();
  }, [fetchCurrentUser]);

  return { status, retry };
}
