import { Node } from "reactflow";
import { test, expect } from "vitest";
import { NodeData } from "../type";
import { composePipelineMetadataMapFromNodes } from "./composePipelineMetadataMapFromNodes";

test("should compose initial pipeline metadata", () => {
  const nodes: Node<NodeData>[] = [
    {
      id: "ai_0",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        setup: {},
        note: null,
      },
    },
    {
      id: "variable",
      position: {
        x: 100,
        y: 100,
      },
      data: {
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
        fields: {},
        note: null,
      },
    },
  ];

  const metadata = composePipelineMetadataMapFromNodes(nodes);

  expect(metadata).toStrictEqual({
    component: {
      ai_0: {
        note: null,
        x: 0,
        y: 0,
      },
      variable: {
        note: "hello-world",
        x: 100,
        y: 100,
      },
      response: {
        note: null,
        x: 300,
        y: 300,
      },
    },
  });
});
