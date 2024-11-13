import { Node } from "reactflow";

import { NodeData } from "../../../flow/types";

export function createStartNode() {
  const node: Node<NodeData> = {
    id: "start",
    type: "startNode",
    position: { x: 0, y: 0 },
    data: {},
  };

  return node;
}
