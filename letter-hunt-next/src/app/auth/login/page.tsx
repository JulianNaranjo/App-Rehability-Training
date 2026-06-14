"use client";

/**
 * Login Page
 *
 * Authenticates a user via the existing auth store and redirects to
 * `/dashboard` on success. Renders any store error (invalid
 * credentials or unexpected failure) under the password field.
 *
 * @module LoginPage
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button, Card, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const router = useRouter();

  const loading = status === "loading";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const success = await login({ email, password });

    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Iniciar sesión
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Accede a tu cuenta para continuar.
        </p>
      </header>

      <Card variant="default" padding="lg">
        <form onSubmit={onSubmit} className="space-y-6">
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
            autoComplete="current-password"
            error={error}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            Entrar
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="text-primary-600 dark:text-primary-400 font-medium">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
