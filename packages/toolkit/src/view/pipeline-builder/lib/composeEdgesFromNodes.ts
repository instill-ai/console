import { v4 as uuidv4 } from "uuid";
import { Edge, Node } from "reactflow";

import type { InstillReference, NodeData } from "../type";
import type { InstillJSONSchema, Nullable } from "../../../lib";
import { getReferenceFromComponentConfiguration } from "./getReferenceFromComponentConfiguration";
import { getOperatorInputOutputSchema } from "./getOperatorInputOutputSchema";
import { getConnectorInputOutputSchema } from "./getConnectorInputOutputSchema";
import {
  InstillAIOpenAPIProperty,
  getPropertiesFromOpenAPISchema,
} from "./getPropertiesFromOpenAPISchema";
import { getConnectorOperatorComponentConfiguration } from "./getConnectorOperatorComponentConfiguration";
import {
  isEndComponent,
  isIteratorComponent,
  isOperatorComponent,
  isStartComponent,
} from "./checkComponentType";

type ReferenceWithNodeInfo = {
  nodeID: string;
} & InstillReference;

export function composeEdgesFromNodes(nodes: Node<NodeData>[]) {
  let references: ReferenceWithNodeInfo[] = [];
  let edges: Edge[] = [];

  for (const node of nodes) {
    if (isStartComponent(node.data)) {
      const referencesOfThisNode = getReferenceFromComponentConfiguration(
        node.data.start_component.fields
      );

      references = [
        ...references,
        ...referencesOfThisNode.map((reference) => ({
          nodeID: node.id,
          ...reference,
        })),
      ];
      continue;
    }

    if (isEndComponent(node.data)) {
      const referencesOfThisNode = getReferenceFromComponentConfiguration(
        node.data.end_component.fields
      );

      references = [
        ...references,
        ...referencesOfThisNode.map((reference) => ({
          nodeID: node.id,
          ...reference,
        })),
      ];
      continue;
    }

    if (isIteratorComponent(node.data)) {
      continue;
    }

    const configuration = getConnectorOperatorComponentConfiguration(node.data);

    const referencesOfThisNode =
      getReferenceFromComponentConfiguration(configuration);

    references = [
      ...references,
      ...referencesOfThisNode.map((reference) => ({
        nodeID: node.id,
        ...reference,
      })),
    ];
  }

  const { otherNodesAvailableReferences, startNodeAvailableRefernces } =
    getAvailableReferences(nodes);

  console.log(otherNodesAvailableReferences, startNodeAvailableRefernces);

  for (const reference of references) {
    const newEdges = composeEdgeForReference({
      reference,
      startNodeAvailableRefernces,
      otherNodesAvailableReferences,
      currentEdges: edges,
    });

    edges = [...edges, ...newEdges];
  }

  return edges;
}

// Hepler function to get all the available reference target, Take start
// operator for example, something like start.foo or start.bar. And for
// other nodes, something like comp_1.output.foo or comp_1.output.bar
function getAvailableReferences(nodes: Node<NodeData>[]) {
  const otherNodesAvailableReferences: string[] = [];
  const startNodeAvailableRefernces: string[] = [];

  for (const node of nodes) {
    // 1. Start node is special, we need to get all the metadata keys as available
    if (isStartComponent(node.data)) {
      for (const [key] of Object.entries(node.data.start_component.fields)) {
        startNodeAvailableRefernces.push(`${node.id}.${key}`);
      }

      continue;
    }

    // 2. We can ignore end node, they can not be referenced/connected
    if (isEndComponent(node.data)) {
      continue;
    }

    if (isIteratorComponent(node.data)) {
      continue;
    }

    let outputSchema: Nullable<InstillJSONSchema> = null;

    // 3. Extract output properties for operator and connector
    if (isOperatorComponent(node.data)) {
      const { outputSchema: operatorOutputSchema } =
        getOperatorInputOutputSchema(node.data);
      outputSchema = operatorOutputSchema;
    } else {
      const { outputSchema: connectorOutputSchema } =
        getConnectorInputOutputSchema(node.data);
      outputSchema = connectorOutputSchema;
    }
    let outputProperties: InstillAIOpenAPIProperty[] = [];

    if (outputSchema) {
      outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
    }

    // We only need to have the key, not the full path. And we will enhance this
    // part by adapting InstillFormTree

    for (const outputProperty of outputProperties) {
      otherNodesAvailableReferences.push(
        `${node.id}.output.${
          outputProperty.path?.includes(".")
            ? outputProperty.path?.split(".").pop()
            : outputProperty.path
        }`
      );
    }

    // User can also reference the whole component's output object
    otherNodesAvailableReferences.push(`${node.id}.output`);
  }

  return {
    otherNodesAvailableReferences,
    startNodeAvailableRefernces,
  };
}

// Helper function to compose the edges for a reference
function composeEdgeForReference({
  reference,
  otherNodesAvailableReferences,
  startNodeAvailableRefernces,
  currentEdges,
}: {
  reference: ReferenceWithNodeInfo;
  otherNodesAvailableReferences: string[];
  startNodeAvailableRefernces: string[];
  currentEdges: Edge[];
}) {
  const newEdges: Edge[] = [];

  // check whether the referenced target is available for start operator
  if (reference.referenceValue.withoutCurlyBraces.split(".")[0] === "start") {
    const referenceIsAvailable = startNodeAvailableRefernces.some(
      (availableReference) =>
        checkReferenceIsAvailable(
          reference.referenceValue.withoutCurlyBraces,
          availableReference
        )
    );

    // check whether we already have an edge for this reference
    const hasNoEdgeForThisReference =
      currentEdges.find(
        (edge) => edge.source === "start" && edge.target === reference.nodeID
      ) === undefined;

    if (referenceIsAvailable && hasNoEdgeForThisReference && reference.nodeID) {
      newEdges.push({
        id: uuidv4(),
        source: "start",
        target: reference.nodeID,
        type: "customEdge",
      });
    }

    // Here is for other nodes
  } else {
    const referenceIsAvailable = otherNodesAvailableReferences.some(
      (availableReference) =>
        checkReferenceIsAvailable(
          reference.referenceValue.withoutCurlyBraces,
          availableReference
        )
    );

    const hasNoEdgeForThisReference =
      currentEdges.find(
        (edge) =>
          edge.source ===
            reference.referenceValue.withoutCurlyBraces.split(".")[0] &&
          edge.target === reference.nodeID
      ) === undefined;

    if (referenceIsAvailable && hasNoEdgeForThisReference && reference.nodeID) {
      newEdges.push({
        id: uuidv4(),
        source: reference.referenceValue.withoutCurlyBraces.split(".")[0],
        target: reference.nodeID,
        type: "customEdge",
      });
    }
  }

  return newEdges;
}

function checkReferenceIsAvailable(
  value: string,
  availableReference: string
): boolean {
  const referenceValueWithoutArray = value.replaceAll(/\[[^\]]+\]/g, "");

  if (availableReference === referenceValueWithoutArray) {
    return true;
  }

  // If the target is a object, user can reference the key in the object, which may
  // break how we check if the reference is available. For example, if the target is
  // "comp_1.output.my_object", and the user reference "comp_1.output.my_object.key1",
  // we should still allow it.

  // This should also allow comp_1.output

  const firstThreeLayersOfReferenceValueWithoutArray =
    referenceValueWithoutArray.split(".").slice(0, 2).join(".");

  if (
    firstThreeLayersOfReferenceValueWithoutArray.includes(availableReference)
  ) {
    return true;
  }

  return false;
}
