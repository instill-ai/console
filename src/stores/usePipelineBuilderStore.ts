import { create } from "zustand";
import { Nullable } from "@instill-ai/toolkit";
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
import { ConnectorNodeData } from "@/types";

export type PipelineBuilderState = {
  pipelineUid: Nullable<string>;
  pipelineId: Nullable<string>;
  pipelineDescription: Nullable<string>;
  nodes: Node<ConnectorNodeData>[];
  edges: Edge[];
  selectedNode: Nullable<Node<ConnectorNodeData>>;
  selectedEdge: Nullable<Edge>;
  rightPanelIsOpen: boolean;
  isSavingPipeline: boolean;
  resourceFormIsDirty: boolean;
};

export type PipelineBuilderAction = {
  init: () => void;
  setPipelineUid: (pipelineUid: Nullable<string>) => void;
  setPipelineId: (pipelineId: Nullable<string>) => void;
  setPipelineDescription: (pipelineDescription: Nullable<string>) => void;
  setNodes: (nodes: Node<ConnectorNodeData>[]) => void;
  updateNodes: (
    fn: (prev: Node<ConnectorNodeData>[]) => Node<ConnectorNodeData>[]
  ) => void;
  setEdges: (edges: Edge[]) => void;
  updateEdges: (fn: (prev: Edge[]) => Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<ConnectorNodeData>) => void;
  removeNode: (node: Node<ConnectorNodeData>) => void;
  setSelectedNode: (nodes: Nullable<Node<ConnectorNodeData>>) => void;
  updateSelectedNode: (
    fn: (
      prev: Nullable<Node<ConnectorNodeData>>
    ) => Nullable<Node<ConnectorNodeData>>
  ) => void;
  setSelectedEdge: (edges: Nullable<Edge>) => void;
  updateSelectedEdge: (fn: (prev: Nullable<Edge>) => Nullable<Edge>) => void;
  setRightPanelIsOpen: (fn: (prev: boolean) => boolean) => void;
  setIsSavingPipeline: (isSavingPipeline: boolean) => void;
  updateResourceFormIsDirty: (fn: (prev: boolean) => boolean) => void;
};

export type PipelineBuilderStore = PipelineBuilderState & PipelineBuilderAction;

export const pipelineBuilderInitialState: PipelineBuilderState = {
  pipelineId: null,
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  pipelineUid: null,
  pipelineDescription: null,
  isSavingPipeline: false,
  rightPanelIsOpen: false,
  resourceFormIsDirty: false,
};

export const usePipelineBuilderStore = create<PipelineBuilderStore>()(
  (set, get) => ({
    ...pipelineBuilderInitialState,
    init: () => set(() => pipelineBuilderInitialState),
    setIsSavingPipeline: (isSavingPipeline: boolean) =>
      set((state) => {
        return { ...state, isSavingPipeline };
      }),
    setPipelineDescription: (pipelineDescription: Nullable<string>) =>
      set((state) => {
        return { ...state, pipelineDescription };
      }),
    setPipelineUid: (pipelineUid: Nullable<string>) =>
      set((state) => {
        return { ...state, pipelineUid };
      }),
    setPipelineId: (pipelineId: Nullable<string>) =>
      set((state) => {
        return { ...state, pipelineId };
      }),
    setRightPanelIsOpen: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return { ...state, rightPanelIsOpen: fn(state.rightPanelIsOpen) };
      }),
    setNodes: (nodes: Node<ConnectorNodeData>[]) =>
      set((state) => {
        return { ...state, nodes };
      }),
    updateNodes: (
      fn: (prev: Node<ConnectorNodeData>[]) => Node<ConnectorNodeData>[]
    ) =>
      set((state) => {
        return { ...state, nodes: fn(state.nodes) };
      }),
    setEdges: (edges: Edge[]) =>
      set((state) => {
        return { ...state, edges };
      }),
    updateEdges: (fn: (prev: Edge[]) => Edge[]) =>
      set((state) => {
        return { ...state, edges: fn(state.edges) };
      }),
    setSelectedNode: (node: Nullable<Node<ConnectorNodeData>>) =>
      set((state) => {
        return { ...state, selectedNode: node };
      }),
    updateSelectedNode: (
      fn: (
        prev: Nullable<Node<ConnectorNodeData>>
      ) => Nullable<Node<ConnectorNodeData>>
    ) =>
      set((state) => {
        return { ...state, selectedNode: fn(state.selectedNode) };
      }),
    setSelectedEdge: (edge: Nullable<Edge>) =>
      set((state) => {
        return { ...state, selectedEdge: edge };
      }),
    updateSelectedEdge: (fn: (prev: Nullable<Edge>) => Nullable<Edge>) =>
      set((state) => {
        return { ...state, selectedEdge: fn(state.selectedEdge) };
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
          { ...connection, animated: true, type: "customEdge" },
          get().edges
        ),
      });
    },
    addNode: (node: Node<ConnectorNodeData>) =>
      set((state) => ({
        ...state,
        nodes: [...state.nodes, node],
      })),
    removeNode: (node: Node<ConnectorNodeData>) =>
      set((state) => ({
        ...state,
        nodes: state.nodes.filter(
          (e) => e.data.connector.id === node.data.connector.id
        ),
      })),
    updateResourceFormIsDirty: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return { ...state, resourceFormIsDirty: fn(state.resourceFormIsDirty) };
      }),
  })
);
