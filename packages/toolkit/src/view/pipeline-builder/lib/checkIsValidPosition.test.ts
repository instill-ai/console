import { test, expect } from "vitest";
import { PipelineRecipe } from "../../../lib";
import { checkIsValidPosition } from "./checkIsValidPosition";

test("should check position is not valid", () => {
  const recipe: PipelineRecipe = {
    components: [
      {
        id: "ai_0",
        resource_name: "stability-dev",
        resource: null,
        definition_name: "connector-definitions/stability-ai",
        connector_definition: null,
        type: "COMPONENT_TYPE_CONNECTOR_AI",
        configuration: {},
      },
    ],
    version: "v1alpha",
  };

  const isValid = checkIsValidPosition(recipe, {
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
    components: [
      {
        id: "ai_0",
        resource_name: "stability-dev",
        resource: null,
        definition_name: "connector-definitions/stability-ai",
        connector_definition: null,
        type: "COMPONENT_TYPE_CONNECTOR_AI",
        configuration: {},
      },
    ],
    version: "v1alpha",
  };

  const isValid = checkIsValidPosition(recipe, {
    components: [
      {
        id: "ai_0",
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
    components: [
      {
        id: "ai_0",
        resource_name: "stability-dev",
        resource: null,
        definition_name: "connector-definitions/stability-ai",
        connector_definition: null,
        type: "COMPONENT_TYPE_CONNECTOR_AI",
        configuration: {},
      },
      {
        id: "ai_1",
        resource_name: "stability-dev",
        resource: null,
        definition_name: "connector-definitions/stability-ai",
        connector_definition: null,
        type: "COMPONENT_TYPE_CONNECTOR_AI",
        configuration: {},
      },
      {
        id: "ai_2",
        resource_name: "stability-dev",
        resource: null,
        definition_name: "connector-definitions/stability-ai",
        connector_definition: null,
        type: "COMPONENT_TYPE_CONNECTOR_AI",
        configuration: {},
      },
    ],
    version: "v1alpha",
  };

  const isValid = checkIsValidPosition(recipe, {
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
