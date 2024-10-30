import { config } from "dotenv";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { handlers } from "./mocks/handlers.js";

config();

// The order is important.
const worker = setupServer(...handlers);

// Start worker before all tests
beforeAll(() => {
  worker.events.on("request:start", ({ request }) => {
    console.log("Outgoing:", request.method, request.url);
  });
  worker.listen();
});

//  Close worker after all tests
afterAll(() => {
  worker.close();
});

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  worker.resetHandlers();
});
