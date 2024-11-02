import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";
import { listPaginatedIntegrationsResponseValidator } from "./type";

test("listPaginatedIntegrations", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const integrations = await client.core.integration.listPaginatedIntegrations({
    pageToken: "pageToken",
    pageSize: 10,
    filter: "filter",
  });

  const parsedData =
    listPaginatedIntegrationsResponseValidator.safeParse(integrations);

  expect(parsedData.success).toBe(true);
});
