import { v4 as uuidv4 } from "uuid";
import { Edge, Node } from "reactflow";

import type { InstillReference, NodeData } from "../type";
import type { InstillJSONSchema, Nullable } from "../../../lib";
import { getReferencesFromAny } from "./getReferencesFromAny";
import {
  InstillAIOpenAPIProperty,
  getPropertiesFromOpenAPISchema,
} from "./getPropertiesFromOpenAPISchema";
import { getGeneralComponentConfiguration } from "./getGeneralComponentConfiguration";

import { createNodesFromPipelineComponents } from "./createNodesFromPipelineComponents";
import {
  isGeneralNode,
  isIteratorNode,
  isResponseNode,
  isTriggerNode,
} from "./checkNodeType";
import { getGeneralComponentInOutputSchema } from "./getGeneralComponentInOutputSchema";

type ReferenceWithNodeInfo = {
  nodeID: string;
} & InstillReference;

export function composeEdgesFromNodes(nodes: Node<NodeData>[]) {
  let edges: Edge[] = [];

  const references = getConnectedReferencesFromNodes(nodes);

  const { otherNodesAvailableReferences, startNodeAvailableRefernces } =
    getAvailableReferencesFromNodes(nodes);

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

function getConnectedReferencesFromNodes(
  nodes: Node<NodeData>[],
  overwriteNodeID?: string
) {
  let references: ReferenceWithNodeInfo[] = [];
  for (const node of nodes) {
    if (isTriggerNode(node)) {
      const referencesOfThisNode = getReferencesFromAny(node.data.fields);

      references = [
        ...references,
        ...referencesOfThisNode.map((reference) => ({
          nodeID: overwriteNodeID ?? node.id,
          ...reference,
        })),
      ];
      continue;
    }

    if (isResponseNode(node)) {
      const referencesOfThisNode = getReferencesFromAny(node.data.fields);

      references = [
        ...references,
        ...referencesOfThisNode.map((reference) => ({
          nodeID: node.id,
          ...reference,
        })),
      ];
      continue;
    }

    if (isIteratorNode(node)) {
      const inputReference = getReferencesFromAny(node.data.input);

      const nodesInInterator = createNodesFromPipelineComponents(
        node.data.component
      );

      // All the components inside the iterator will belong to the iterator itself
      const componentsReferences = getConnectedReferencesFromNodes(
        nodesInInterator,
        node.id
      );

      references = [
        ...references,
        ...inputReference.map((reference) => ({
          nodeID: overwriteNodeID ?? node.id,
          ...reference,
        })),
        ...componentsReferences,
      ];

      continue;
    }

    if (isGeneralNode(node)) {
      const configuration = getGeneralComponentConfiguration(node.data);

      const referencesOfThisNode = getReferencesFromAny(configuration);

      references = [
        ...references,
        ...referencesOfThisNode.map((reference) => ({
          nodeID: overwriteNodeID ?? node.id,
          ...reference,
        })),
      ];

      continue;
    }
  }

  return references;
}

// Hepler function to get all the available reference target, Take trigger
// node for example, something like trigger.foo or trigger.bar. And for
// other nodes, something like comp_1.output.foo or comp_1.output.bar
function getAvailableReferencesFromNodes(nodes: Node<NodeData>[]) {
  const otherNodesAvailableReferences: string[] = [];
  const startNodeAvailableRefernces: string[] = [];

  for (const node of nodes) {
    // 1. Extract available references for trigger node
    if (isTriggerNode(node)) {
      for (const [key] of Object.entries(node.data.fields)) {
        startNodeAvailableRefernces.push(`trigger.${key}`);
      }
    }

    // 2. Extract output properties for operator, connector and iterator

    let outputSchema: Nullable<InstillJSONSchema> = null;

    if (isIteratorNode(node)) {
      outputSchema = node.data.data_specification?.output ?? null;
    }

    if (isGeneralNode(node)) {
      const { outputSchema: GeneralNodeOutputSchema } =
        getGeneralComponentInOutputSchema(node.data);
      outputSchema = GeneralNodeOutputSchema;
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

  // check whether the referenced target is available for trigger node
  if (
    reference.referenceValue.withoutCurlyBraces
      .split(".")[0]
      .includes("trigger")
  ) {
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
        (edge) => edge.source === "trigger" && edge.target === reference.nodeID
      ) === undefined;

    if (referenceIsAvailable && hasNoEdgeForThisReference && reference.nodeID) {
      newEdges.push({
        id: uuidv4(),
        source: "trigger",
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

  // Once a value includes [], we will loosely check the reference.
  // For example, we will connect st_1.output["Foo"], even st_1 don't have
  // Foo field
  if (value.includes("[") || value.includes("]")) {
    const valueComponentID = referenceValueWithoutArray.split(".")[0];
    const avaiableReferenceComponentID = availableReference.split(".")[0];
    if (valueComponentID === avaiableReferenceComponentID) {
      return true;
    }

    return false;
  }

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
