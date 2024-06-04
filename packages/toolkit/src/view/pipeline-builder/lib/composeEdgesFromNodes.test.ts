import { test, expect } from "vitest";
import { composeEdgesFromNodes } from "./composeEdgesFromNodes";
import { Node } from "reactflow";
import { NodeData } from "../type";

test("should get edges from basic components", () => {
  const nodes: Node<NodeData>[] = [
    {
      id: "variable",
      type: "variableNode",
      data: {
        fields: {
          texts: {
            instillFormat: "array:string",
            title: "texts",
            description: "",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "response",
      type: "responseNode",
      data: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${variable.texts}",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
  ];

  const edges = composeEdgesFromNodes(nodes);

  expect(edges[0].source).toBe("variable");
  expect(edges[0].target).toBe("response");

  const wrongNodes: Node<NodeData>[] = [
    {
      id: "variable",
      type: "variableNode",
      data: {
        fields: {
          texts: {
            instillFormat: "array:string",
            title: "texts",
            description: "",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "response",
      type: "responseNode",
      data: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
  ];

  const wrongComponentsEdges = composeEdgesFromNodes(wrongNodes);

  expect(wrongComponentsEdges.length).toBe(0);
});

test("should strictly check the reference field exist", () => {
  const nodes: Node<NodeData>[] = [
    {
      id: "variable",
      type: "variableNode",
      data: {
        fields: {
          texts: {
            instillFormat: "array:string",
            title: "texts",
            description: "",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "response",
      type: "responseNode",
      data: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${variable.foo}",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
  ];

  const edges = composeEdgesFromNodes(nodes);

  expect(edges.length).toBe(0);
});

test("should loosely check the reference field exist when reference has square brace", () => {
  const nodes: Node<NodeData>[] = [
    {
      id: "variable",
      type: "variableNode",
      data: {
        fields: {
          texts: {
            instillFormat: "array:string",
            title: "texts",
            description: "",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "response",
      type: "responseNode",
      data: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${variable['foo bar']['aaa']}",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
  ];

  const edges = composeEdgesFromNodes(nodes);

  expect(edges[0].source).toBe("variable");
  expect(edges[0].target).toBe("response");

  const wrongNodes: Node<NodeData>[] = [
    {
      id: "variable",
      type: "variableNode",
      data: {
        fields: {
          texts: {
            instillFormat: "array:string",
            title: "texts",
            description: "",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "response",
      type: "responseNode",
      data: {
        fields: {
          result: {
            title: "result",
            description: "",
            value: "${foo['foo bar']['aaa']}",
          },
        },
        note: null,
      },
      position: { x: 0, y: 0 },
    },
  ];

  const wrongComponentsEdges = composeEdgesFromNodes(wrongNodes);

  expect(wrongComponentsEdges.length).toBe(0);
});
