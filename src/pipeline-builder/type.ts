import { ConnectorWithWatchState } from "@instill-ai/toolkit";

export type ConnectorNodeData = {
  nodeType: "connector";
  connector: ConnectorWithWatchState;
};

export type EmptyNodeData = {
  nodeType: "empty";
};

export type StartNodeData = {
  nodeType: "start";
};

export type EndNodeData = {
  nodeType: "end";
};

export type NodeData =
  | ConnectorNodeData
  | EmptyNodeData
  | StartNodeData
  | EndNodeData;
