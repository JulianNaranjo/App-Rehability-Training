"use client";

import { AuthGate } from "@/components/ui";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

/**
 * Reverse access guard for auth pages (`/auth/login`, `/auth/register`).
 *
 * Drives rendering from `useAuthStore.status` via
 * `useRedirectIfAuthenticated()`:
 * - `'authenticated'`: renders `<AuthGate>` as a placeholder while the
 *   hook's redirect effect replaces the route with `/dashboard`. The
 *   auth form is never rendered in this case.
 * - any other status (`'idle' | 'loading' | 'unauthenticated' | 'error'`):
 *   renders `children` (the auth form), no redirect.
 */
export function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const { status } = useRedirectIfAuthenticated();

  if (status === "authenticated") {
    return <AuthGate />;
  }

  return <>{children}</>;
}
