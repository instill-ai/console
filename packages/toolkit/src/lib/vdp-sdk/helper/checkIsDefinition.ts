import { ComponentDefinition, IteratorDefinition } from "instill-sdk";

export function isComponentDefinition(
  definition: IteratorDefinition | ComponentDefinition,
): definition is ComponentDefinition {
  return "type" in definition;
}

export function isIteratorDefinition(
  definition: IteratorDefinition | ComponentDefinition,
): definition is IteratorDefinition {
  return definition.id === "iterator";
}
