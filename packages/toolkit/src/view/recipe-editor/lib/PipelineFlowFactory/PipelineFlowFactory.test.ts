import { PipelineRecipe } from "instill-sdk";
import { expect, test } from "vitest";

import { PipelineFlowFactory } from "./PipelineFlowFactory";

test("should create basic variable and output flow from recipe", () => {
  const recipe: PipelineRecipe = {
    output: {
      out: {
        value: "${variable.foo}",
        title: "out",
      },
    },
    variable: {
      foo: {
        instillFormat: "string",
        title: "foo",
      },
    },
    version: "v1beta",
  };

  const flowFactory = new PipelineFlowFactory(recipe);

  const { nodes, edges } = flowFactory.createFlow();

  expect(nodes).toStrictEqual([
    {
      id: "start",
      type: "startNode",
      position: { x: 0, y: 0 },
      data: {},
    },
    {
      id: "variable",
      type: "variableNode",
      data: recipe.variable,
      position: { x: 0, y: 0 },
    },
    {
      id: "output",
      type: "outputNode",
      data: recipe.output,
      position: { x: 0, y: 0 },
    },
  ]);

  expect(edges[0]?.source).toBe("start");
  expect(edges[0]?.target).toBe("output");
});

test("should create array-index variable and output flow from recipe", () => {
  const recipe: PipelineRecipe = {
    output: {
      out: {
        value: "${variable.foo[0]}",
        title: "out",
      },
    },
    variable: {
      foo: {
        instillFormat: "array:string",
        title: "foo",
      },
    },
    version: "v1beta",
  };

  const flowFactory = new PipelineFlowFactory(recipe);

  const { nodes, edges } = flowFactory.createFlow();

  expect(nodes).toStrictEqual([
    {
      id: "start",
      type: "startNode",
      position: { x: 0, y: 0 },
      data: {},
    },
    {
      id: "variable",
      type: "variableNode",
      data: recipe.variable,
      position: { x: 0, y: 0 },
    },
    {
      id: "output",
      type: "outputNode",
      data: recipe.output,
      position: { x: 0, y: 0 },
    },
  ]);

  expect(edges[0]?.source).toBe("start");
  expect(edges[0]?.target).toBe("output");
});
