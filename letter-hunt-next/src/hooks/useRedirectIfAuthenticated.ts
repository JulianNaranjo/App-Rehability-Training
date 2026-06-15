"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";
import type { AuthStatus } from "@/types/auth";

interface RedirectIfAuthenticatedGate {
  /** The raw `useAuthStore` status. */
  status: AuthStatus;
}

/**
 * Logic hook for the `<RedirectIfAuthenticated>` reverse guard.
 *
 * Mirrors `useRequireAuth`: redirects to `/dashboard` (via
 * `router.replace`) once the status resolves to `'authenticated'`.
 * The redirect runs as a `useEffect` side effect (never during
 * render). Renders no UI — see `<RedirectIfAuthenticated>` for the
 * render contract.
 */
export function useRedirectIfAuthenticated(): RedirectIfAuthenticatedGate {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
    // `router` is intentionally omitted: `useRouter()` may return a new
    // object reference per render, and the redirect must fire exactly
    // once per resolved `status` transition (spec AC7), not on every
    // re-render of an already-authenticated status.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { status };
}
