import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/store/auth-store";

import { useRequireAuth } from "./useRequireAuth";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

/** Tiny harness exposing the hook's return value via the DOM. */
function Harness() {
  const { status, retry } = useRequireAuth();

  return (
    <div>
      <span data-testid="status">{status}</span>
      <button onClick={retry}>retry</button>
    </div>
  );
}

describe("useRequireAuth", () => {
  beforeEach(() => {
    resetStore();
    replace.mockClear();
    vi.spyOn(useAuthStore.getState(), "fetchCurrentUser").mockResolvedValue(undefined);
  });

  it("returns 'idle' status and does not redirect", () => {
    useAuthStore.setState({ status: "idle" });

    render(<Harness />);

    expect(screen.getByTestId("status")).toHaveTextContent("idle");
    expect(replace).not.toHaveBeenCalled();
  });

  it("returns 'loading' status and does not redirect", () => {
    useAuthStore.setState({ status: "loading" });

    render(<Harness />);

    expect(screen.getByTestId("status")).toHaveTextContent("loading");
    expect(replace).not.toHaveBeenCalled();
  });

  it("returns 'authenticated' status and does not redirect", () => {
    useAuthStore.setState({ status: "authenticated" });

    render(<Harness />);

    expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects to /auth/login exactly once when status is 'unauthenticated'", () => {
    useAuthStore.setState({ status: "unauthenticated" });

    render(<Harness />);

    expect(replace).toHaveBeenCalledWith("/auth/login");
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it("does not redirect again on re-render without a status change", () => {
    useAuthStore.setState({ status: "unauthenticated" });

    const { rerender } = render(<Harness />);
    rerender(<Harness />);

    expect(replace).toHaveBeenCalledTimes(1);
  });

  it("returns 'error' status, does not redirect, and exposes retry calling fetchCurrentUser", async () => {
    useAuthStore.setState({ status: "error", error: "boom" });

    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByTestId("status")).toHaveTextContent("error");
    expect(replace).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "retry" }));

    expect(useAuthStore.getState().fetchCurrentUser).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  });

  it("recovers from error -> loading -> authenticated without ever redirecting", () => {
    useAuthStore.setState({ status: "error", error: "boom" });

    const { rerender } = render(<Harness />);

    act(() => {
      useAuthStore.setState({ status: "loading", error: undefined });
    });
    rerender(<Harness />);

    act(() => {
      useAuthStore.setState({ status: "authenticated" });
    });
    rerender(<Harness />);

    expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
    expect(replace).not.toHaveBeenCalled();
  });

  it("recovers from error -> loading -> unauthenticated and redirects exactly once", () => {
    useAuthStore.setState({ status: "error", error: "boom" });

    const { rerender } = render(<Harness />);

    act(() => {
      useAuthStore.setState({ status: "loading", error: undefined });
    });
    rerender(<Harness />);

    act(() => {
      useAuthStore.setState({ status: "unauthenticated" });
    });
    rerender(<Harness />);

    expect(replace).toHaveBeenCalledWith("/auth/login");
    expect(replace).toHaveBeenCalledTimes(1);
  });
});
