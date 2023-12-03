import {
  ConnectorNode,
  EmptyNode,
  EndOperatorNode,
  OperatorNode,
  StartOperatorNode,
} from "../components";

export const nodeTypes = {
  startNode: StartOperatorNode,
  connectorNode: ConnectorNode,
  emptyNode: EmptyNode,
  endNode: EndOperatorNode,
  operatorNode: OperatorNode,
};
