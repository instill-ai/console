/* eslint-disable */

import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";

test("listConnectorDefinitions", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    strict: true,
    debug: true,
  });

  const connectorDefinitionsWithoutPagination =
    await client.vdp.component.listConnectorDefinitions({
      enablePagination: false,
    });

  expect(connectorDefinitionsWithoutPagination).rejects.not.toThrow();
});
