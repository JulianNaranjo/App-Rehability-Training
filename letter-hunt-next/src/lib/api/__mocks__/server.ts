// MSW node server wired into Vitest's setup file.
//
// Tests can call `server.use(...)` to override handlers per-test
// (e.g. to simulate a 401 or 500 response).

import { setupServer } from "msw/node";

import { handlers } from "@/lib/api/__mocks__/handlers";

export const server = setupServer(...handlers);
