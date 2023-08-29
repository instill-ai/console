import { v4 as uuidv4 } from "uuid";
import { Edge, Node } from "reactflow";
import { ConfigurationReference } from "./extractReferencesFromConfiguration";
import { NodeData, StartNodeData } from "./type";

export function composeEdgesFromReferences(
  references: ConfigurationReference[],
  nodes: Node<NodeData>[]
) {
  const edges: Edge[] = [];

  const startNode = nodes.find(
    (node) => node.data.nodeType === "start"
  ) as Node<StartNodeData>;

  console.log(nodes, references);

  for (const reference of references) {
    if (reference.referenceValue.split(".")[0] === "start") {
      const hasKeyInStartNodeBody = Object.keys(
        startNode.data.component.configuration.body
      ).includes(reference.referenceValue.split(".")[1]);

      const hasNoEdgeForThisReference =
        edges.find(
          (edge) => edge.source === "start" && edge.target === reference.nodeId
        ) === undefined;

      if (hasKeyInStartNodeBody && hasNoEdgeForThisReference) {
        edges.push({
          id: uuidv4(),
          source: "start",
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    } else {
      const hasNoEdgeForThisReference =
        edges.find(
          (edge) =>
            edge.source === reference.referenceValue.split(".")[0] &&
            edge.target === reference.nodeId
        ) === undefined;

      if (hasNoEdgeForThisReference) {
        edges.push({
          id: uuidv4(),
          source: reference.referenceValue.split(".")[0],
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    }
  }

  console.log(edges);

  return edges;
}
