import { Node } from "reactflow";
import { test, expect } from "vitest";
import { NodeData } from "../type";
import { composePipelineMetadataFromNodes } from "./composePipelineMetadataFromNodes";

test("should compose initial pipeline metadata", () => {
  const nodes: Node<NodeData>[] = [
    {
      id: "ai_0",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        id: "ai_0",
        connector_component: {
          connector_name: "stability-dev",
          connector: null,
          definition_name: "connector-definitions/stability-ai",
          definition: null,
          task: "",
          input: {},
          condition: null,
        },
        note: null,
      },
    },
    {
      id: "start",
      position: {
        x: 100,
        y: 100,
      },
      data: {
        id: "start",
        start_component: {
          fields: {},
        },
        note: "hello-world",
      },
    },
    {
      id: "end",
      position: {
        x: 300,
        y: 300,
      },
      data: {
        id: "end",
        end_component: {
          fields: {},
        },
        note: null,
      },
    },
  ];

  const metadata = composePipelineMetadataFromNodes(nodes);

  expect(metadata).toStrictEqual({
    components: [
      { id: "ai_0", note: null, x: 0, y: 0 },
      { id: "start", note: "hello-world", x: 100, y: 100 },
      { id: "end", note: null, x: 300, y: 300 },
    ],
  });
});
