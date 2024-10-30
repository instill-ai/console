import { expect, test } from "vitest";

import { InstillAPIClient } from "../../main";
import {
  createNamespacePipelineResponseValidator,
  getNamespacePipelineResponseValidator,
  listAccessiblePipelinesWithPaginationResponseValidator,
  listNamespacePipelinesWithPaginationResponseValidator,
  updateNamespacePipelineResponseValidator,
} from "./types";

test("listAccessiblePipelines", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const pipelines = await client.vdp.pipeline.listAccessiblePipelines({
    enablePagination: true,
  });

  const parsedData =
    listAccessiblePipelinesWithPaginationResponseValidator.safeParse(pipelines);

  expect(parsedData.success).toBe(true);
});

test("listNamespacePipelines", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const pipelines = await client.vdp.pipeline.listNamespacePipelines({
    namespaceId: "nid",
    enablePagination: true,
  });

  const parsedData =
    listNamespacePipelinesWithPaginationResponseValidator.safeParse(pipelines);

  expect(parsedData.success).toBe(true);
});

test("getNamespacePipeline", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const pipeline = await client.vdp.pipeline.getNamespacePipeline({
    namespaceId: "nid",
    pipelineId: "pid",
  });

  const parsedData = getNamespacePipelineResponseValidator.safeParse(pipeline);

  expect(parsedData.success).toBe(true);
});

test("createNamespacePipeline", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const pipeline = await client.vdp.pipeline.createNamespacePipeline({
    namespaceId: "nid",
    id: "hello",
    recipe: {
      version: "v1beta",
    },
    metadata: {},
  });

  const parsedData =
    createNamespacePipelineResponseValidator.safeParse(pipeline);

  expect(parsedData.success).toBe(true);
});

test("updateNamespacePipeline", async () => {
  const client = new InstillAPIClient({
    baseURL: `http://localhost:8080/${process.env.INSTILL_API_VERSION}`,
    apiToken: "test",
    debug: true,
  });

  const pipeline = await client.vdp.pipeline.updateNamespacePipeline({
    namespaceId: "nid",
    pipelineId: "pid",
    recipe: {
      version: "v1beta",
    },
    metadata: {},
  });

  const parsedData =
    updateNamespacePipelineResponseValidator.safeParse(pipeline);

  expect(parsedData.success).toBe(true);
});
