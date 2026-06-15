import { render, screen } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/store/auth-store";

import { useRedirectIfAuthenticated } from "./useRedirectIfAuthenticated";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

/** Tiny harness exposing the hook's return value via the DOM. */
function Harness() {
  const { status } = useRedirectIfAuthenticated();

  return <span data-testid="status">{status}</span>;
}

describe("useRedirectIfAuthenticated", () => {
  beforeEach(() => {
    resetStore();
    replace.mockClear();
  });

  it("redirects to /dashboard exactly once when status is 'authenticated'", () => {
    useAuthStore.setState({ status: "authenticated" });

    render(<Harness />);

    expect(replace).toHaveBeenCalledWith("/dashboard");
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it.each(["idle", "loading", "unauthenticated", "error"] as const)(
    "does not redirect when status is '%s'",
    (status) => {
      useAuthStore.setState({ status, error: status === "error" ? "boom" : undefined });

      render(<Harness />);

      expect(screen.getByTestId("status")).toHaveTextContent(status);
      expect(replace).not.toHaveBeenCalled();
    },
  );

  it("redirects exactly once when transitioning idle -> loading -> authenticated", () => {
    useAuthStore.setState({ status: "idle" });

    const { rerender } = render(<Harness />);

    act(() => {
      useAuthStore.setState({ status: "loading" });
    });
    rerender(<Harness />);

    act(() => {
      useAuthStore.setState({ status: "authenticated" });
    });
    rerender(<Harness />);

    expect(replace).toHaveBeenCalledWith("/dashboard");
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it("does not redirect again on re-render without a status change", () => {
    useAuthStore.setState({ status: "authenticated" });

    const { rerender } = render(<Harness />);
    rerender(<Harness />);

    expect(replace).toHaveBeenCalledTimes(1);
  });
});
