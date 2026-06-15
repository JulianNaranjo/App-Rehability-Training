"use client";

/**
 * Register Page
 *
 * Creates a new account via the existing auth store and redirects to
 * `/dashboard` on success. Renders the error from the user's own submit
 * attempt under the password field — never a global/session-bootstrap
 * error, which must not surface before the user interacts.
 *
 * @module RegisterPage
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button, Card, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const register = useAuthStore((state) => state.register);
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  const loading = status === "loading";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setFormError(undefined);

    const success = await register({ email, password, displayName });

    if (success) {
      router.push("/dashboard");
      return;
    }

    setFormError(useAuthStore.getState().error);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-10">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">
          Crear cuenta
        </h1>
        <p className="text-text-secondary">
          Regístrate para empezar a jugar.
        </p>
      </header>

      <Card variant="elevated" padding="lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Nombre"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            disabled={loading}
            autoComplete="name"
          />

          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={loading}
            autoComplete="new-password"
            error={formError}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            Crear cuenta
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-text-secondary">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="text-primary-600 font-medium hover:text-primary-700">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
