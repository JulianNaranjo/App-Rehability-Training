import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface AuthErrorProps {
  /** Invoked when the user activates the retry control. */
  onRetry: () => void;
}

/**
 * Inline error UI for auth gate primitives.
 *
 * Rendered by `<RequireAuth>` when the session status is `'error'`.
 * Stays on the current route (no redirect) and lets the user retry
 * the session fetch.
 */
export function AuthError({ onRetry }: AuthErrorProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Card
        variant="outlined"
        padding="lg"
        className="max-w-md space-y-4 text-center border-error-300"
      >
        <h2 className="text-lg font-semibold text-error-700">
          No pudimos verificar tu sesión
        </h2>
        <p className="text-sm text-text-secondary">
          Ocurrió un problema al conectar con el servidor. Comprueba tu
          conexión e inténtalo de nuevo.
        </p>
        <Button variant="error" onClick={onRetry}>
          Reintentar
        </Button>
      </Card>
    </div>
  );
}
