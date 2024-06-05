import { test, expect } from "vitest";
import { PipelineRecipe } from "../../../lib";
import { checkIsValidPosition } from "./checkIsValidPosition";

test("should check position is not valid", () => {
  const recipe = {
    variable: {},
    component: {
      ai_0: {
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        setup: {},
      },
    },
    output: {},
    version: "v1beta",
  } satisfies PipelineRecipe;

  const isValid = checkIsValidPosition({
    component: recipe.component,
    metadata: {
      component: {
        ai_0: {
          x: 0,
          y: 0,
          note: null,
        },
      },
    },
  });

  expect(isValid).toBe(false);
});

test("should check position is valid", () => {
  const recipe = {
    variable: {},
    output: {},
    component: {
      ai_0: {
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        setup: {},
      },
    },
    version: "v1beta",
  } satisfies PipelineRecipe;

  const isValid = checkIsValidPosition({
    component: recipe.component,
    metadata: {
      component: {
        ai_0: {
          x: 0,
          y: 0,
          note: null,
        },
        variable: {
          x: 0,
          y: 0,
          note: null,
        },
        response: {
          x: 0,
          y: 0,
          note: null,
        },
      },
    },
  });

  expect(isValid).toBe(true);
});

test("should check position is not valid even there is one missing data", () => {
  const recipe = {
    variable: {},
    output: {},
    component: {
      ai_0: {
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        setup: {},
      },
      ai_1: {
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        setup: {},
      },
      ai_2: {
        type: "stability-ai",
        definition: null,
        task: "",
        input: {},
        condition: null,
        setup: {},
      },
    },

    version: "v1beta",
  } satisfies PipelineRecipe;

  const isValid = checkIsValidPosition({
    component: recipe.component,
    metadata: {
      component: {
        ai_1: {
          x: 0,
          y: 0,
          note: null,
        },
        ai_2: {
          x: 0,
          y: 0,
          note: null,
        },
      },
    },
  });

  expect(isValid).toBe(false);
});
