import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getCurrentUser, login, logout, register } from "@/lib/api/auth";
import { devHandlers } from "@/lib/api/__mocks__/dev-handlers";
import { server } from "@/lib/api/__mocks__/server";
import { isUnauthorized } from "@/lib/api/errors";

const SEED_CREDENTIALS = { email: "dev@letter-hunt.local", password: "devpassword" };

describe("dev-handlers seed user", () => {
  beforeEach(() => {
    server.use(...devHandlers);
  });

  afterEach(async () => {
    await logout();
  });

  it("logs in with the seed credentials without any prior registration", async () => {
    const user = await login(SEED_CREDENTIALS);

    expect(user).toEqual({
      id: "user-seed",
      email: "dev@letter-hunt.local",
      displayName: "Dev User",
      role: "patient",
    });
  });

  it("does not leak the password field on the seed login response", async () => {
    const user = await login(SEED_CREDENTIALS);

    expect(user).not.toHaveProperty("password");
  });

  it("rejects the seed email with a wrong password as 401 INVALID_CREDENTIALS", async () => {
    let error: unknown;

    try {
      await login({ email: SEED_CREDENTIALS.email, password: "wrong-password" });
    } catch (caught) {
      error = caught;
    }

    expect(isUnauthorized(error)).toBe(true);
    expect(error).toMatchObject({ status: 401, code: "INVALID_CREDENTIALS" });
  });

  it("rejects /auth/me before any login despite the seed existing", async () => {
    let error: unknown;

    try {
      await getCurrentUser();
    } catch (caught) {
      error = caught;
    }

    expect(isUnauthorized(error)).toBe(true);
  });

  it("resolves /auth/me with the seed user after logging in", async () => {
    await login(SEED_CREDENTIALS);

    const user = await getCurrentUser();

    expect(user).toEqual({
      id: "user-seed",
      email: "dev@letter-hunt.local",
      displayName: "Dev User",
      role: "patient",
    });
  });

  it("still allows new registrations after the seed exists, with no id collision", async () => {
    const user = await register({
      email: "new-after-seed@example.com",
      password: "secret-password",
      displayName: "New After Seed",
    });

    expect(user.id).not.toBe("user-seed");
    expect(user).toMatchObject({ email: "new-after-seed@example.com", displayName: "New After Seed" });
  });
});
