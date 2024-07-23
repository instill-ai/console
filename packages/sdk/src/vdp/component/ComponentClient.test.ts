/* eslint-disable */

import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";
import {
  getConnectorDefinitionResponseValidator,
  getOperatorDefinitionResponseValidator,
  listConnectorDefinitionsWithPaginationResponseValidator,
  listOperatorDefinitionsWithPaginationResponseValidator,
} from "./types";

test("getConnectorDefinition", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const definition = await client.vdp.component.getConnectorDefinition({
    connectorDefinitionName: "connector-definitions/test",
  });

  const parsedData =
    getConnectorDefinitionResponseValidator.safeParse(definition);

  expect(parsedData.success).toBe(true);
});

test("listConnectorDefinitions", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const definitions = await client.vdp.component.listConnectorDefinitions({
    enablePagination: true,
  });

  const parsedData =
    listConnectorDefinitionsWithPaginationResponseValidator.safeParse(
      definitions,
    );

  expect(parsedData.success).toBe(true);
});

test("getOperatorDefinition", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const definition = await client.vdp.component.getOperatorDefinition({
    operatorDefinitionName: "operator-definitions/test",
  });

  const parsedData =
    getOperatorDefinitionResponseValidator.safeParse(definition);

  expect(parsedData.success).toBe(true);
});

test("listOperatorDefinitions with pagination", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const definitions = await client.vdp.component.listOperatorDefinitions({
    enablePagination: true,
  });

  const parsedData =
    listOperatorDefinitionsWithPaginationResponseValidator.safeParse(
      definitions,
    );

  expect(parsedData.success).toBe(true);
});
