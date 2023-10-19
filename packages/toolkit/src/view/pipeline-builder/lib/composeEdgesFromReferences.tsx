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

export function composeEdgesFromReferences(
  references: PipelineComponentReference[],
  nodes: Node<NodeData>[]
) {
  const edges: Edge[] = [];

  const otherNodesAvailableReferences: string[] = [];
  const startNodeAvailableRefernces: string[] = [];

  nodes.forEach((node) => {
    if (!node.data.component) return;

    if (node.data.nodeType === "start") {
      for (const [key] of Object.entries(
        node.data.component.configuration.metadata
      )) {
        startNodeAvailableRefernces.push(`${node.id}.${key}`);
      }
      return;
    }

    if (node.data.nodeType === "end") return;

    const { inputSchema, outputSchema } = getConnectorInputOutputSchema(
      node.data.component
    );

    let inputProperties: InstillAIOpenAPIProperty[] = [];
    let outputProperties: InstillAIOpenAPIProperty[] = [];

    if (inputSchema) {
      inputProperties = getPropertiesFromOpenAPISchema(inputSchema);
    }

    if (outputSchema) {
      outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
    }

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
  });

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
          availableReference ===
          reference.referenceValue.withoutCurlyBraces.replaceAll(
            /\[[^\]]+\]/g,
            ""
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
          availableReference ===
          reference.referenceValue.withoutCurlyBraces.replaceAll(
            /\[[^\]]+\]/g,
            ""
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
            availableReference ===
            referenceValue.withoutCurlyBraces.replaceAll(/\[[^\]]+\]/g, "")
        );

        if (referenceIsAvailable) {
          referenceValuesWithStartOperator.push(
            referenceValue.withoutCurlyBraces
          );
        }
      } else {
        const referenceIsAvailable = otherNodesAvailableReferences.some(
          (availableReference) =>
            availableReference ===
            referenceValue.withoutCurlyBraces.replaceAll(/\[[^\]]+\]/g, "")
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
