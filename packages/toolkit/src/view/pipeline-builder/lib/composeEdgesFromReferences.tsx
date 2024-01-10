import { v4 as uuidv4 } from "uuid";
import { Edge, Node } from "reactflow";

import {
  getConnectorInputOutputSchema,
  InstillAIOpenAPIProperty,
  getPropertiesFromOpenAPISchema,
} from ".";
import {
  DoubleCurlyBraceReference,
  NodeData,
  PipelineComponentReference,
  SingleCurlyBraceReference,
} from "../type";
import { InstillJSONSchema, Nullable } from "../../../lib";
import { getOperatorInputOutputSchema } from "./getOperatorInputOutputSchema";

export function composeEdgesFromReferences(
  references: PipelineComponentReference[],
  nodes: Node<NodeData>[]
) {
  const edges: Edge[] = [];

  const otherNodesAvailableReferences: string[] = [];
  const startNodeAvailableRefernces: string[] = [];

  // 1. loop through nodes to get all available references

  nodes.forEach((node) => {
    if (!node.data.component) return;

    // 1.1 Start node is special, we need to get all the metadata keys as available
    if (node.data.nodeType === "start") {
      if (node.data.component.configuration.metadata) {
        for (const [key] of Object.entries(
          node.data.component.configuration.metadata
        )) {
          startNodeAvailableRefernces.push(`${node.id}.${key}`);
        }
      }

      return;
    }

    // 1.2 We can ignore end node, they can not be referenced/connected
    if (node.data.nodeType === "end") return;

    let inputSchema: Nullable<InstillJSONSchema> = null;
    let outputSchema: Nullable<InstillJSONSchema> = null;

    // 1.3 Extract references for operator and connector
    if (node.data.nodeType === "operator") {
      const {
        inputSchema: operatorInputSchema,
        outputSchema: operatorOutputSchema,
      } = getOperatorInputOutputSchema(node.data.component);
      inputSchema = operatorInputSchema;
      outputSchema = operatorOutputSchema;
    } else {
      const {
        inputSchema: connectorInputSchema,
        outputSchema: connectorOutputSchema,
      } = getConnectorInputOutputSchema(node.data.component);
      inputSchema = connectorInputSchema;
      outputSchema = connectorOutputSchema;
    }

    let inputProperties: InstillAIOpenAPIProperty[] = [];
    let outputProperties: InstillAIOpenAPIProperty[] = [];

    if (inputSchema) {
      inputProperties = getPropertiesFromOpenAPISchema(inputSchema);
    }

    if (outputSchema) {
      outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
    }

    // We only need to have the key, not the full path. And we will enhance this
    // part by adapting InstillFormTree

    for (const inputProperty of inputProperties) {
      otherNodesAvailableReferences.push(
        `${node.id}.input.${
          inputProperty.path?.includes(".")
            ? inputProperty.path?.split(".").pop()
            : inputProperty.path
        }`
      );
    }

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
  });

  // 2. Loop throught references to compose edges

  for (const reference of references) {
    if (reference.type === "singleCurlyBrace") {
      edges.push(
        ...composeEdgeForSingleCurlyBrace({
          reference,
          startNodeAvailableRefernces,
          otherNodesAvailableReferences,
        })
      );
    } else {
      edges.push(
        ...composeEdgeForDoubleCurlyBrace({
          reference,
          startNodeAvailableRefernces,
          otherNodesAvailableReferences,
        })
      );
    }
  }

  function composeEdgeForSingleCurlyBrace({
    reference,
    otherNodesAvailableReferences,
    startNodeAvailableRefernces,
  }: {
    reference: SingleCurlyBraceReference;
    otherNodesAvailableReferences: string[];
    startNodeAvailableRefernces: string[];
  }) {
    const edgesForSingleCurlyBrace: Edge[] = [];

    if (reference.referenceValue.withoutCurlyBraces.split(".")[0] === "start") {
      const referenceIsAvailable = startNodeAvailableRefernces.some(
        (availableReference) =>
          checkReferenceIsAvailable(
            reference.referenceValue.withoutCurlyBraces,
            availableReference
          )
      );

      const hasNoEdgeForThisReference =
        edgesForSingleCurlyBrace.find(
          (edge) => edge.source === "start" && edge.target === reference.nodeId
        ) === undefined;

      if (
        referenceIsAvailable &&
        hasNoEdgeForThisReference &&
        reference.nodeId
      ) {
        edgesForSingleCurlyBrace.push({
          id: uuidv4(),
          source: "start",
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    } else {
      const referenceIsAvailable = otherNodesAvailableReferences.some(
        (availableReference) =>
          checkReferenceIsAvailable(
            reference.referenceValue.withoutCurlyBraces,
            availableReference
          )
      );

      const hasNoEdgeForThisReference =
        edgesForSingleCurlyBrace.find(
          (edge) =>
            edge.source ===
              reference.referenceValue.withoutCurlyBraces.split(".")[0] &&
            edge.target === reference.nodeId
        ) === undefined;

      if (
        referenceIsAvailable &&
        hasNoEdgeForThisReference &&
        reference.nodeId
      ) {
        edgesForSingleCurlyBrace.push({
          id: uuidv4(),
          source: reference.referenceValue.withoutCurlyBraces.split(".")[0],
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    }

    return edgesForSingleCurlyBrace;
  }

  function composeEdgeForDoubleCurlyBrace({
    reference,
    otherNodesAvailableReferences,
    startNodeAvailableRefernces,
  }: {
    reference: DoubleCurlyBraceReference;
    otherNodesAvailableReferences: string[];
    startNodeAvailableRefernces: string[];
  }) {
    const edgesForDoubleCurlyBrace: Edge[] = [];
    const referenceValuesWithStartOperator: string[] = [];
    const referenceValuesWithOtherNode: string[] = [];

    for (const referenceValue of reference.referenceValues) {
      if (referenceValue.withoutCurlyBraces.split(".")[0] === "start") {
        const referenceIsAvailable = startNodeAvailableRefernces.some(
          (availableReference) =>
            checkReferenceIsAvailable(
              referenceValue.withoutCurlyBraces,
              availableReference
            )
        );

        if (referenceIsAvailable) {
          referenceValuesWithStartOperator.push(
            referenceValue.withoutCurlyBraces
          );
        }
      } else {
        const referenceIsAvailable = otherNodesAvailableReferences.some(
          (availableReference) =>
            checkReferenceIsAvailable(
              referenceValue.withoutCurlyBraces,
              availableReference
            )
        );

        if (referenceIsAvailable) {
          referenceValuesWithOtherNode.push(referenceValue.withoutCurlyBraces);
        }
      }
    }

    if (referenceValuesWithStartOperator.length > 0) {
      const hasNoEdgeForThisReferenceToStart =
        edgesForDoubleCurlyBrace.find(
          (edge) => edge.source === "start" && edge.target === reference.nodeId
        ) === undefined;

      if (hasNoEdgeForThisReferenceToStart && reference.nodeId) {
        edgesForDoubleCurlyBrace.push({
          id: uuidv4(),
          source: "start",
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    }

    for (const referenceValue of referenceValuesWithOtherNode) {
      const hasNoEdgeForThisReferenceToOtherNode =
        edgesForDoubleCurlyBrace.find(
          (edge) =>
            edge.source === referenceValue.split(".")[0] &&
            edge.target === reference.nodeId
        ) === undefined;

      if (hasNoEdgeForThisReferenceToOtherNode && reference.nodeId) {
        edgesForDoubleCurlyBrace.push({
          id: uuidv4(),
          source: referenceValue.split(".")[0],
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    }

    return edgesForDoubleCurlyBrace;
  }

  return edges;
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
