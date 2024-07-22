import { config } from "dotenv";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { handlers as coreHandlers } from "./mocks/core/handlers.js";
import { handlers as modelHandlers } from "./mocks/model/handlers.js";
import { handlers as vdpHandlers } from "./mocks/vdp/handlers.js";

config();

const worker = setupServer(...coreHandlers, ...modelHandlers, ...vdpHandlers);

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
