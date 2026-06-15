import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockUser } from "@/lib/api/__mocks__/handlers";
import { server } from "@/lib/api/__mocks__/server";
import { API_BASE_URL } from "@/lib/api/client";
import { UNAUTHORIZED_MESSAGE, UNKNOWN_ERROR_MESSAGE } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth-store";

import LoginPage from "./page";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

describe("LoginPage", () => {
  beforeEach(() => {
    resetStore();
    push.mockClear();
    replace.mockClear();
  });

  it("renders email and password fields and a submit button", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("redirects to /dashboard and does not render the form for an authenticated visitor", () => {
    useAuthStore.setState({
      user: mockUser,
      status: "authenticated",
      error: undefined,
    });

    render(<LoginPage />);

    expect(replace).toHaveBeenCalledWith("/dashboard");
    expect(replace).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText(/correo electrónico/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /entrar/i })).not.toBeInTheDocument();
  });

  it("does not surface a global/bootstrap error before the user submits", () => {
    // Simulate a failed session bootstrap (e.g. backend unreachable),
    // which sets the shared store error. The form must stay clean.
    useAuthStore.setState({ user: null, status: "error", error: UNKNOWN_ERROR_MESSAGE });

    render(<LoginPage />);

    expect(screen.queryByText(UNKNOWN_ERROR_MESSAGE)).not.toBeInTheDocument();
  });

  it("navigates to /dashboard on successful login", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/correo electrónico/i), mockUser.email);
    await user.type(screen.getByLabelText(/contraseña/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows UNAUTHORIZED_MESSAGE and stays on the page for invalid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/correo electrónico/i), mockUser.email);
    await user.type(screen.getByLabelText(/contraseña/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(UNAUTHORIZED_MESSAGE)).toBeInTheDocument();
    });

    expect(push).not.toHaveBeenCalled();
  });

  it("shows a generic message and stays on the page for a network/unknown error", async () => {
    server.use(
      http.post(`${API_BASE_URL}/auth/login`, () => {
        return HttpResponse.error();
      }),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/correo electrónico/i), mockUser.email);
    await user.type(screen.getByLabelText(/contraseña/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().status).toBe("error");
    });

    expect(push).not.toHaveBeenCalled();
  });

  it("disables the submit button and shows loading while the request is in flight", async () => {
    server.use(
      http.post(`${API_BASE_URL}/auth/login`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return HttpResponse.json(mockUser, { status: 200 });
      }),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/correo electrónico/i), mockUser.email);
    await user.type(screen.getByLabelText(/contraseña/i), "correct-password");

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("prevents a double submit while loading", async () => {
    server.use(
      http.post(`${API_BASE_URL}/auth/login`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return HttpResponse.json(mockUser, { status: 200 });
      }),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/correo electrónico/i), mockUser.email);
    await user.type(screen.getByLabelText(/contraseña/i), "correct-password");

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);
    await user.click(submitButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalledTimes(1);
    });
  });
});
