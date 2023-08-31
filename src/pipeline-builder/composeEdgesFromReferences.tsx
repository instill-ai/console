import { v4 as uuidv4 } from "uuid";
import { Edge, Node } from "reactflow";
import {
  DoubleCurlyBraceReference,
  PipelineComponentReference,
  SingleCurlyBraceReference,
} from "./extractReferencesFromConfiguration";
import { NodeData, StartNodeData } from "./type";

export function composeEdgesFromReferences(
  references: PipelineComponentReference[],
  nodes: Node<NodeData>[]
) {
  const edges: Edge[] = [];

  const startNode = nodes.find(
    (node) => node.data.nodeType === "start"
  ) as Node<StartNodeData>;

  for (const reference of references) {
    if (reference.type === "singleCurlyBrace") {
      edges.push(...composeEdgeForSingleCurlyBrace(reference));
    } else {
      edges.push(...composeEdgeForDoubleCurlyBrace(reference));
    }
  }

  function composeEdgeForSingleCurlyBrace(
    reference: SingleCurlyBraceReference
  ) {
    const edgesForSingleCurlyBrace: Edge[] = [];

    if (reference.referenceValue.withoutCurlyBraces.split(".")[0] === "start") {
      const hasKeyInStartOperatorBody = Object.keys(
        startNode.data.component.configuration.body
      ).includes(reference.referenceValue.withoutCurlyBraces.split(".")[1]);

      const hasNoEdgeForThisReference =
        edgesForSingleCurlyBrace.find(
          (edge) => edge.source === "start" && edge.target === reference.nodeId
        ) === undefined;

      if (hasKeyInStartOperatorBody && hasNoEdgeForThisReference) {
        edgesForSingleCurlyBrace.push({
          id: uuidv4(),
          source: "start",
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    } else {
      const hasKeyInStartOperatorBody = Object.keys(
        startNode.data.component.configuration.body
      ).includes(reference.referenceValue.withoutCurlyBraces.split(".")[1]);

      const hasNoEdgeForThisReference =
        edgesForSingleCurlyBrace.find(
          (edge) =>
            edge.source ===
              reference.referenceValue.withoutCurlyBraces.split(".")[0] &&
            edge.target === reference.nodeId
        ) === undefined;

      if (hasKeyInStartOperatorBody && hasNoEdgeForThisReference) {
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

  function composeEdgeForDoubleCurlyBrace(
    reference: DoubleCurlyBraceReference
  ) {
    const edgesForDoubleCurlyBrace: Edge[] = [];
    const referenceValuesWithStartOperator: string[] = [];
    const referenceValuesWithOtherNode: string[] = [];

    for (const referenceValue of reference.referenceValues) {
      if (referenceValue.withoutCurlyBraces.split(".")[0] === "start") {
        referenceValuesWithStartOperator.push(
          referenceValue.withoutCurlyBraces
        );
      } else {
        referenceValuesWithOtherNode.push(referenceValue.withoutCurlyBraces);
      }
    }

    const hasKeyInStartOperatorBody = Object.keys(
      startNode.data.component.configuration.body
    ).some((key) => {
      const referenceValueKeys = referenceValuesWithStartOperator.map(
        (referenceValue) => referenceValue.split(".")[1]
      );

      return referenceValueKeys.includes(key);
    });

    if (
      referenceValuesWithStartOperator.length > 0 &&
      hasKeyInStartOperatorBody
    ) {
      edgesForDoubleCurlyBrace.push({
        id: uuidv4(),
        source: "start",
        target: reference.nodeId,
        type: "customEdge",
      });
    }

    for (const referenceValue of referenceValuesWithOtherNode) {
      const hasNoEdgeForThisReference =
        edgesForDoubleCurlyBrace.find(
          (edge) =>
            edge.source === referenceValue.split(".")[0] &&
            edge.target === reference.nodeId
        ) === undefined;

      if (hasNoEdgeForThisReference) {
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
