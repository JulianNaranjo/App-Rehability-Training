import { render } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { mockUser, unauthorizedHandlers } from "@/lib/api/__mocks__/handlers";
import { server } from "@/lib/api/__mocks__/server";
import { API_BASE_URL } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";

const resetStore = () => {
  useAuthStore.setState({ user: null, status: "idle", error: undefined });
};

function StrictModeWrapper({ children }: { children: React.ReactNode }) {
  return <StrictMode>{children}</StrictMode>;
}

describe("AuthBootstrap", () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it("renders nothing visible", () => {
    const { container } = render(<AuthBootstrap />);

    expect(container).toBeEmptyDOMElement();
  });

  it("calls fetchCurrentUser on mount and authenticates with the session user", async () => {
    render(<AuthBootstrap />);

    await vi.waitFor(() => {
      expect(useAuthStore.getState().status).toBe("authenticated");
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeUndefined();
  });

  it("sets status to unauthenticated without an error on a 401 response", async () => {
    server.use(...unauthorizedHandlers);

    render(<AuthBootstrap />);

    await vi.waitFor(() => {
      expect(useAuthStore.getState().status).toBe("unauthenticated");
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.error).toBeUndefined();
  });

  it("calls /auth/me exactly once even with React StrictMode double-invoke", async () => {
    let callCount = 0;
    server.use(
      http.get(`${API_BASE_URL}/auth/me`, () => {
        callCount += 1;
        return HttpResponse.json(mockUser, { status: 200 });
      }),
    );

    render(
      <StrictModeWrapper>
        <AuthBootstrap />
      </StrictModeWrapper>,
    );

    await vi.waitFor(() => {
      expect(useAuthStore.getState().status).toBe("authenticated");
    });

    expect(callCount).toBe(1);
  });
});
