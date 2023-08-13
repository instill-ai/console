import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";

import { ConnectorNodeData, NodeData } from "./type";
import { Nullable } from "@instill-ai/toolkit";

export type PipelineBuilderState = {
  pipelineUid: Nullable<string>;
  pipelineId: Nullable<string>;
  pipelineDescription: Nullable<string>;
  nodes: Node<NodeData>[];
  edges: Edge[];
  rightPanelIsOpen: boolean;
  isSavingPipeline: boolean;
  pipelineRecipeIsDirty: boolean;
  pipelineIsNew: boolean;
  selectedConnectorNode: Nullable<Node<ConnectorNodeData>>;
  connectorFormIsDirty: boolean;
};

export type PipelineBuilderAction = {
  init: () => void;
  setPipelineUid: (pipelineUid: Nullable<string>) => void;
  setPipelineId: (pipelineId: Nullable<string>) => void;
  setPipelineDescription: (pipelineDescription: Nullable<string>) => void;
  updateNodes: (fn: (prev: Node<NodeData>[]) => Node<NodeData>[]) => void;
  updateEdges: (fn: (prev: Edge[]) => Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateRightPanelIsOpen: (fn: (prev: boolean) => boolean) => void;
  updateIsSavingPipeline: (fn: (prev: boolean) => boolean) => void;
  updatePipelineRecipeIsDirty: (fn: (prev: boolean) => boolean) => void;
  updatePipelineIsNew: (fn: (prev: boolean) => boolean) => void;
  updateSelectedConnectorNode: (
    fn: (
      prev: Nullable<Node<ConnectorNodeData>>
    ) => Nullable<Node<ConnectorNodeData>>
  ) => void;
  updateConnectorFormIsDirty: (fn: (prev: boolean) => boolean) => void;
};

export type PipelineBuilderStore = PipelineBuilderState & PipelineBuilderAction;

export const pipelineBuilderInitialState: PipelineBuilderState = {
  pipelineId: null,
  pipelineUid: null,
  pipelineDescription: null,
  nodes: [],
  edges: [],
  isSavingPipeline: false,
  rightPanelIsOpen: false,
  pipelineRecipeIsDirty: false,
  pipelineIsNew: false,
  selectedConnectorNode: null,
  connectorFormIsDirty: false,
};

export const usePipelineBuilderStore = create<PipelineBuilderStore>()(
  (set, get) => ({
    ...pipelineBuilderInitialState,
    init: () => set(() => pipelineBuilderInitialState),
    setPipelineId: (pipelineId: Nullable<string>) =>
      set((state) => {
        return { ...state, pipelineId };
      }),
    setPipelineUid: (pipelineUid: Nullable<string>) =>
      set((state) => {
        return { ...state, pipelineUid };
      }),
    setPipelineDescription: (pipelineDescription: Nullable<string>) =>
      set((state) => {
        return { ...state, pipelineDescription };
      }),
    updateRightPanelIsOpenRightPanelIsOpen: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return { ...state, rightPanelIsOpen: fn(state.rightPanelIsOpen) };
      }),
    updateNodes: (fn: (prev: Node<NodeData>[]) => Node<NodeData>[]) =>
      set((state) => {
        return {
          ...state,
          nodes: fn(state.nodes),
        };
      }),
    updateEdges: (fn: (prev: Edge[]) => Edge[]) =>
      set((state) => {
        return {
          ...state,
          edges: fn(state.edges),
        };
      }),
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(
          { ...connection, animated: false, type: "customEdge" },
          get().edges
        ),
      });
    },
    updatePipelineRecipeIsDirty: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          pipelineRecipeIsDirty: fn(state.pipelineRecipeIsDirty),
        };
      }),
    updatePipelineIsNew: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          pipelineIsNew: fn(state.pipelineIsNew),
        };
      }),
    updateIsSavingPipeline: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          isSavingPipeline: fn(state.isSavingPipeline),
        };
      }),
    updateRightPanelIsOpen: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          rightPanelIsOpen: fn(state.rightPanelIsOpen),
        };
      }),
    updateSelectedConnectorNode: (
      fn: (
        prev: Nullable<Node<ConnectorNodeData>>
      ) => Nullable<Node<ConnectorNodeData>>
    ) =>
      set((state) => {
        return {
          ...state,
          selectedConnectorNode: fn(state.selectedConnectorNode),
        };
      }),
    updateConnectorFormIsDirty: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          connectorFormIsDirty: fn(state.connectorFormIsDirty),
        };
      }),
  })
);
