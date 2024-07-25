import { IteratorDefinition, OperatorDefinition } from "instill-sdk";

import { ConnectorDefinition } from "../../../lib";
import { generateUniqueIndex } from "./generateUniqueIndex";
import { transformConnectorDefinitionIDToComponentIDPrefix } from "./transformConnectorDefinitionIDToComponentIDPrefix";

export function generateUniqueNodeIdFromDefinition(
  definition: ConnectorDefinition | OperatorDefinition | IteratorDefinition,
  currentIds: string[],
) {
  // Construct the default component ID prefix. For example, if the definition
  // is `connector-definitions/instill-ai`, the prefix will be `instill-ai`
  const nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
    definition.id,
  );

  // Generate a new component index
  // Because all the nodes' ID need to be unique, included the components in the
  // iterator, so we need to group the two set of nodes together. Under the
  // editing iterator mode, nodes will be the nodes in the iterator, and
  // tempSavedNodesForEditingIteratorFlow will be the nodes outside the iterator
  const nodeIndex = generateUniqueIndex(currentIds, nodePrefix);

  return `${nodePrefix}-${nodeIndex}`;
}
