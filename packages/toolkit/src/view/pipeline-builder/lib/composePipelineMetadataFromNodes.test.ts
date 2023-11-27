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
        nodeType: "connector",
        component: {
          id: "ai_0",
          resource_name: "stability-dev",
          resource: null,
          definition_name: "connector-definitions/stability-ai",
          connector_definition: null,
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          configuration: {},
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
        nodeType: "start",
        component: {
          id: "start",
          resource: null,
          resource_name: null,
          definition_name: "connector-definitions/start",
          operator_definition: null,
          type: "COMPONENT_TYPE_OPERATOR",
          configuration: {},
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
        nodeType: "end",
        component: {
          id: "end",
          resource: null,
          resource_name: null,
          definition_name: "connector-definitions/end",
          operator_definition: null,
          type: "COMPONENT_TYPE_OPERATOR",
          configuration: {},
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
