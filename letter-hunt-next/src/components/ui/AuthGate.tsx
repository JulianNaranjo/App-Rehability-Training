import { Card } from "@/components/ui/Card";

/**
 * Shared loading placeholder for auth gate primitives.
 *
 * Rendered by `<RequireAuth>` while the session status is `'idle'` or
 * `'loading'`, and as a transient placeholder for `'unauthenticated'`
 * (while the redirect effect commits). Also rendered by
 * `<RedirectIfAuthenticated>` while an authenticated visitor is being
 * redirected away from an auth page.
 */
export function AuthGate() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Card
        variant="elevated"
        padding="lg"
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-400 border-t-transparent opacity-80" />
        <p className="text-sm text-text-secondary">Verificando sesión…</p>
      </Card>
    </div>
  );
}
