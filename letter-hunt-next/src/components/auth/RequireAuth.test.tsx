import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/store/auth-store";

import { RequireAuth } from "./RequireAuth";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

const PROTECTED_CONTENT = "protected content";

function ProtectedChild() {
  return <p>{PROTECTED_CONTENT}</p>;
}

describe("RequireAuth", () => {
  beforeEach(() => {
    resetStore();
    replace.mockClear();
    vi.spyOn(useAuthStore.getState(), "fetchCurrentUser").mockResolvedValue(undefined);
  });

  it("renders the loading gate when status is 'idle'", () => {
    useAuthStore.setState({ status: "idle" });

    render(
      <RequireAuth>
        <ProtectedChild />
      </RequireAuth>,
    );

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
    expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("renders the loading gate when status is 'loading'", () => {
    useAuthStore.setState({ status: "loading" });

    render(
      <RequireAuth>
        <ProtectedChild />
      </RequireAuth>,
    );

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
    expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("renders children when status is 'authenticated'", () => {
    useAuthStore.setState({ status: "authenticated" });

    render(
      <RequireAuth>
        <ProtectedChild />
      </RequireAuth>,
    );

    expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects to /auth/login and renders a placeholder when status is 'unauthenticated'", () => {
    useAuthStore.setState({ status: "unauthenticated" });

    render(
      <RequireAuth>
        <ProtectedChild />
      </RequireAuth>,
    );

    expect(replace).toHaveBeenCalledWith("/auth/login");
    expect(replace).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
  });

  it("renders AuthError with a retry control when status is 'error', and retry calls fetchCurrentUser", async () => {
    useAuthStore.setState({ status: "error", error: "boom" });

    const user = userEvent.setup();
    render(
      <RequireAuth>
        <ProtectedChild />
      </RequireAuth>,
    );

    expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();

    const retryButton = screen.getByRole("button", { name: /reintentar/i });
    await user.click(retryButton);

    expect(useAuthStore.getState().fetchCurrentUser).toHaveBeenCalledTimes(1);
  });
});
