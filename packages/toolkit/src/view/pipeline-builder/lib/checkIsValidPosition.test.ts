import { test, expect } from "vitest";
import { PipelineRecipe } from "../../../lib";
import { checkIsValidPosition } from "./checkIsValidPosition";

test("should check position is not valid", () => {
  const recipe: PipelineRecipe = {
    variable: {},
    component: [
      {
        id: "ai_0",
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        connection: {},
      },
    ],
    output: {},
    version: "v1beta",
  };

  const isValid = checkIsValidPosition({
    component: recipe.component,
    metadata: {
      components: [
        {
          id: "ai_1",
          x: 0,
          y: 0,
          note: null,
        },
      ],
    },
  });

  expect(isValid).toBe(false);
});

test("should check position is valid", () => {
  const recipe: PipelineRecipe = {
    variable: {},
    output: {},
    component: [
      {
        id: "ai_0",
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        connection: {},
      },
    ],
    version: "v1beta",
  };

  const isValid = checkIsValidPosition({
    component: recipe.component,
    metadata: {
      components: [
        {
          id: "ai_0",
          x: 0,
          y: 0,
          note: null,
        },
        {
          id: "trigger",
          x: 0,
          y: 0,
          note: null,
        },
        {
          id: "response",
          x: 0,
          y: 0,
          note: null,
        },
      ],
    },
  });

  expect(isValid).toBe(true);
});

test("should check position is not valid even there is one missing data", () => {
  const recipe: PipelineRecipe = {
    variable: {},
    output: {},
    component: [
      {
        id: "ai_0",
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        connection: {},
      },
      {
        id: "ai_1",
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        connection: {},
      },
      {
        id: "ai_2",
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        connection: {},
      },
    ],
    version: "v1beta",
  };

  const isValid = checkIsValidPosition({
    component: recipe.component,
    metadata: {
      components: [
        {
          id: "ai_1",
          x: 0,
          y: 0,
          note: null,
        },
        {
          id: "ai_2",
          x: 0,
          y: 0,
          note: null,
        },
      ],
    },
  });

  expect(isValid).toBe(false);
});
