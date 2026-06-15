// MSW browser worker wired to the stateful DEV handlers.
//
// Only started in development by MswProvider when NEXT_PUBLIC_API_MOCKING
// is enabled. Not used in tests (those use ./server.ts) or production.

import { setupWorker } from "msw/browser";

import { devHandlers } from "@/lib/api/__mocks__/dev-handlers";

export const worker = setupWorker(...devHandlers);
