"use client";

/**
 * Starts the MSW browser worker in development so the app can run against
 * in-memory mock handlers without a real backend. Enabled only under
 * `next dev` (NODE_ENV === "development"); a production build renders
 * children immediately and never loads the worker.
 *
 * While the worker boots it renders nothing, so children (including
 * AuthBootstrap's initial /auth/me call) mount only after request
 * interception is ready — avoiding a race where the first fetch escapes
 * to the network.
 *
 * Remove this provider (and the dev handlers) once a real backend exists.
 */

import { useEffect, useState } from "react";

const mockingEnabled = process.env.NODE_ENV === "development";

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!mockingEnabled);

  useEffect(() => {
    if (!mockingEnabled) {
      return;
    }

    let active = true;

    import("@/lib/api/__mocks__/browser").then(async ({ worker }) => {
      await worker.start({ onUnhandledRequest: "bypass" });
      if (active) {
        setReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
