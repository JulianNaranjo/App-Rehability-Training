import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/store/auth-store";

import { RedirectIfAuthenticated } from "./RedirectIfAuthenticated";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

const FORM_CONTENT = "auth form";

function AuthForm() {
  return <form aria-label={FORM_CONTENT} />;
}

describe("RedirectIfAuthenticated", () => {
  beforeEach(() => {
    resetStore();
    replace.mockClear();
  });

  it("redirects to /dashboard and does not render children when status is 'authenticated'", () => {
    useAuthStore.setState({ status: "authenticated" });

    render(
      <RedirectIfAuthenticated>
        <AuthForm />
      </RedirectIfAuthenticated>,
    );

    expect(replace).toHaveBeenCalledWith("/dashboard");
    expect(replace).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText(FORM_CONTENT)).not.toBeInTheDocument();
    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
  });

  it.each(["idle", "loading", "unauthenticated", "error"] as const)(
    "renders children and does not redirect when status is '%s'",
    (status) => {
      useAuthStore.setState({ status, error: status === "error" ? "boom" : undefined });

      render(
        <RedirectIfAuthenticated>
          <AuthForm />
        </RedirectIfAuthenticated>,
      );

      expect(screen.getByLabelText(FORM_CONTENT)).toBeInTheDocument();
      expect(replace).not.toHaveBeenCalled();
    },
  );
});
