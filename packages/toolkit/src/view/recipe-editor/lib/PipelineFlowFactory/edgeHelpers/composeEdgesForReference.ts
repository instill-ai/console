import { Edge } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { InstillReferenceWithID } from "../../../flow/types";
import { matchReference } from "./matchReference";

/**
 * Helper function to compose edges for a given reference
 */
export function composeEdgesForReference({
  reference,
  currentEdges,
  variableNodeConnectableReferencePaths,
  componentNodeConnectableReferencePaths,
  runOnNodeConnectableReferencePaths,
}: {
  reference: InstillReferenceWithID;
  currentEdges: Edge[];
  variableNodeConnectableReferencePaths: string[];
  componentNodeConnectableReferencePaths: string[];
  runOnNodeConnectableReferencePaths: string[];
}) {
  const newEdges: Edge[] = [];

  const referencePrefix =
    reference.referenceValue.withoutCurlyBraces.split(".")[0];

  if (referencePrefix && referencePrefix === "on") {
    const referenceIsAvailable = runOnNodeConnectableReferencePaths.some(
      (availableReference) =>
        matchReference(
          reference.referenceValue.withoutCurlyBraces,
          availableReference,
        ),
    );

    // the reference is like "on.event.event_id.event_data_key"
    const sourceId = reference.referenceValue.withoutCurlyBraces.split(".")[2];

    const hasNoEdgeForThisReference =
      currentEdges.find(
        (edge) =>
          edge.source === `on-${sourceId}` && edge.target === reference.id,
      ) === undefined;

    if (referenceIsAvailable && hasNoEdgeForThisReference && reference.id) {
      newEdges.push({
        id: uuidv4(),
        source: `on-${sourceId}`,
        target: reference.id,
        type: "customEdge",
      });
    }

    return newEdges;
  }

  // 1. Check if the reference is toward variable
  if (referencePrefix && referencePrefix === "variable") {
    const referenceIsAvailable = variableNodeConnectableReferencePaths.some(
      (availableReference) =>
        matchReference(
          reference.referenceValue.withoutCurlyBraces,
          availableReference,
        ),
    );

    // check whether we already have an edge for this reference
    const hasNoEdgeForThisReference =
      currentEdges.find(
        (edge) => edge.source === "variable" && edge.target === reference.id,
      ) === undefined;

    if (referenceIsAvailable && hasNoEdgeForThisReference && reference.id) {
      newEdges.push({
        id: uuidv4(),
        source: "variable",
        target: reference.id,
        type: "customEdge",
      });
    }

    return newEdges;
  }

  // 2. Check if the reference is toward component
  const referenceIsAvailable = componentNodeConnectableReferencePaths.some(
    (availableReference) =>
      matchReference(
        reference.referenceValue.withoutCurlyBraces,
        availableReference,
      ),
  );

  const sourceId = reference.referenceValue.withoutCurlyBraces.split(".")[0];

  const hasNoEdgeForThisReference =
    currentEdges.find(
      (edge) => edge.source === sourceId && edge.target === reference.id,
    ) === undefined;

  if (referenceIsAvailable && hasNoEdgeForThisReference && reference.id) {
    if (sourceId) {
      newEdges.push({
        id: uuidv4(),
        source: sourceId,
        target: reference.id,
        type: "customEdge",
      });
    }
  }

  return newEdges;
}
