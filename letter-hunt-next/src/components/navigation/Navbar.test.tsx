import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockUser } from "@/lib/api/__mocks__/handlers";
import { useAuthStore } from "@/store/auth-store";

import { Navbar } from "./Navbar";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push }),
}));

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

describe("Navbar", () => {
  beforeEach(() => {
    resetStore();
    push.mockClear();
  });

  it("shows the user's displayName and a logout control when authenticated", () => {
    useAuthStore.setState({ user: mockUser, status: "authenticated", error: undefined });

    render(<Navbar />);

    expect(screen.getByText(mockUser.displayName)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /iniciar sesión/i })).not.toBeInTheDocument();
  });

  it("shows a login link when unauthenticated, idle, or loading", () => {
    useAuthStore.setState({ user: null, status: "unauthenticated", error: undefined });

    render(<Navbar />);

    expect(screen.getByRole("link", { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.queryByText(mockUser.displayName)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /cerrar sesión/i })).not.toBeInTheDocument();
  });

  it("calls logout and shows the login link after clicking the logout control", async () => {
    useAuthStore.setState({ user: mockUser, status: "authenticated", error: undefined });

    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().status).toBe("unauthenticated");
    });

    expect(screen.getByRole("link", { name: /iniciar sesión/i })).toBeInTheDocument();
  });
});
