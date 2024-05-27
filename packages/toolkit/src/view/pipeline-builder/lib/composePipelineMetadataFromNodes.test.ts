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
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        connection: {},
        note: null,
      },
    },
    {
      id: "trigger",
      position: {
        x: 100,
        y: 100,
      },
      data: {
        id: "trigger",
        fields: {},
        note: "hello-world",
      },
    },
    {
      id: "response",
      position: {
        x: 300,
        y: 300,
      },
      data: {
        id: "response",
        fields: {},
        note: null,
      },
    },
  ];

  const metadata = composePipelineMetadataFromNodes(nodes);

  expect(metadata).toStrictEqual({
    components: [
      { id: "ai_0", note: null, x: 0, y: 0 },
      { id: "trigger", note: "hello-world", x: 100, y: 100 },
      { id: "response", note: null, x: 300, y: 300 },
    ],
  });
});
