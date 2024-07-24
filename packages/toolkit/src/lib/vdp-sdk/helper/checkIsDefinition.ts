import {
  ConnectorDefinition,
  IteratorDefinition,
  OperatorDefinition,
} from "instill-sdk";

export function isConnectorDefinition(
  definition: IteratorDefinition | ConnectorDefinition | OperatorDefinition,
): definition is ConnectorDefinition {
  return "type" in definition;
}

export function isIteratorDefinition(
  definition: IteratorDefinition | ConnectorDefinition | OperatorDefinition,
): definition is IteratorDefinition {
  return definition.id === "iterator";
}

export function isOperatorDefinition(
  definition: IteratorDefinition | ConnectorDefinition | OperatorDefinition,
): definition is OperatorDefinition {
  return definition.name.startsWith("operator-definitions");
}
