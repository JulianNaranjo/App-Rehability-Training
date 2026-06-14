"use client";

import { useEffect, useRef } from "react";

import { useAuthStore } from "@/store/auth-store";

/**
 * Mount-time session hydration.
 *
 * Rendered as a Client child of the root (Server Component) layout.
 * Calls `fetchCurrentUser()` exactly once on mount to derive the
 * session from the httpOnly cookie via `GET /auth/me`. Renders no
 * visible output.
 */
export function AuthBootstrap() {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    void fetchCurrentUser();
  }, [fetchCurrentUser]);

  return null;
}
