"use client";

import { AuthError, AuthGate } from "@/components/ui";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Client-side access gate for protected pages.
 *
 * Drives rendering from `useAuthStore.status` via `useRequireAuth()`:
 * - `'idle' | 'loading'`: renders `<AuthGate>` (loading), no redirect.
 * - `'unauthenticated'`: renders `<AuthGate>` as a placeholder while the
 *   hook's redirect effect replaces the route with `/auth/login`.
 * - `'error'`: renders `<AuthError>` with an inline retry control bound
 *   to `fetchCurrentUser`; stays on the current route.
 * - `'authenticated'`: renders `children`.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { status, retry } = useRequireAuth();

  switch (status) {
    case "idle":
    case "loading":
    case "unauthenticated":
      return <AuthGate />;
    case "error":
      return <AuthError onRetry={retry} />;
    case "authenticated":
      return <>{children}</>;
  }
}
