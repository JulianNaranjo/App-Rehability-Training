import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "@/lib/api/__mocks__/server";
import { API_BASE_URL } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";

import RegisterPage from "./page";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  overrides: { email?: string; password?: string; displayName?: string } = {},
) => {
  const { email = "new@example.com", password = "secret-password", displayName = "New User" } =
    overrides;

  await user.type(screen.getByLabelText(/correo electrónico/i), email);
  await user.type(screen.getByLabelText(/contraseña/i), password);
  await user.type(screen.getByLabelText(/nombre/i), displayName);
};

describe("RegisterPage", () => {
  beforeEach(() => {
    resetStore();
    push.mockClear();
  });

  it("renders email, password, and displayName fields and a submit button", () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it("navigates to /dashboard on successful registration", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows a validation message and stays on the page on a 400 error", async () => {
    server.use(
      http.post(`${API_BASE_URL}/auth/register`, () => {
        return HttpResponse.json(
          { message: "Email and password are required.", code: "VALIDATION_ERROR" },
          { status: 400 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<RegisterPage />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText("Email and password are required.")).toBeInTheDocument();
    });

    expect(push).not.toHaveBeenCalled();
  });

  it("disables the submit button and shows loading while the request is in flight", async () => {
    server.use(
      http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const body = (await request.json()) as { email: string; displayName: string };
        return HttpResponse.json(
          { id: "user-2", email: body.email, displayName: body.displayName, role: "patient" },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<RegisterPage />);

    await fillForm(user);

    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("prevents a double submit while loading", async () => {
    server.use(
      http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const body = (await request.json()) as { email: string; displayName: string };
        return HttpResponse.json(
          { id: "user-2", email: body.email, displayName: body.displayName, role: "patient" },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<RegisterPage />);

    await fillForm(user);

    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });
    await user.click(submitButton);
    await user.click(submitButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalledTimes(1);
    });
  });
});
