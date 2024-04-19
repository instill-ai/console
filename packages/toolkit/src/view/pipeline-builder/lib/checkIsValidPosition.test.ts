import { test, expect } from "vitest";
import { PipelineRecipe } from "../../../lib";
import { checkIsValidPosition } from "./checkIsValidPosition";

test("should check position is not valid", () => {
  const recipe: PipelineRecipe = {
    trigger: {},
    components: [
      {
        id: "ai_0",
        connector_component: {
          connector_name: "stability-dev",
          connector: null,
          definition_name: "connector-definitions/stability-ai",
          definition: null,
          task: "",
          input: {},
          condition: null,
          connection: {},
        },
      },
    ],
    version: "v1beta",
  };

  const isValid = checkIsValidPosition(recipe.components, {
    components: [
      {
        id: "ai_1",
        x: 0,
        y: 0,
        note: null,
      },
    ],
  });

  expect(isValid).toBe(false);
});

test("should check position is valid", () => {
  const recipe: PipelineRecipe = {
    trigger: {
      trigger_by_request: {
        request_fields: {},
        response_fields: {},
      },
    },
    components: [
      {
        id: "ai_0",
        connector_component: {
          connector_name: "stability-dev",
          connector: null,
          definition_name: "connector-definitions/stability-ai",
          definition: null,
          task: "",
          input: {},
          condition: null,
          connection: {},
        },
      },
    ],
    version: "v1beta",
  };

  const isValid = checkIsValidPosition(recipe.components, {
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
  });

  expect(isValid).toBe(true);
});

test("should check position is not valid even there is one missing data", () => {
  const recipe: PipelineRecipe = {
    trigger: {},
    components: [
      {
        id: "ai_0",
        connector_component: {
          connector_name: "stability-dev",
          connector: null,
          definition_name: "connector-definitions/stability-ai",
          definition: null,
          task: "",
          input: {},
          condition: null,
          connection: {},
        },
      },
      {
        id: "ai_1",
        connector_component: {
          connector_name: "stability-dev",
          connector: null,
          definition_name: "connector-definitions/stability-ai",
          definition: null,
          task: "",
          input: {},
          condition: null,
          connection: {},
        },
      },
      {
        id: "ai_2",
        connector_component: {
          connector_name: "stability-dev",
          connector: null,
          definition_name: "connector-definitions/stability-ai",
          definition: null,
          task: "",
          input: {},
          condition: null,
          connection: {},
        },
      },
    ],
    version: "v1beta",
  };

  const isValid = checkIsValidPosition(recipe.components, {
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
  });

  expect(isValid).toBe(false);
});
