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

import { NodeData } from "./type";
import { Nullable, TriggerUserPipelineResponse } from "@instill-ai/toolkit";
import { devtools } from "zustand/middleware";
import { OpenAPIV3 } from "openapi-types";

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
  selectedConnectorNodeId: Nullable<string>;
  connectorFormIsDirty: boolean;
  selectResourceDialogIsOpen: boolean;
  expandAllNodes: boolean;
  testModeEnabled: boolean;
  testModeTriggerResponse: Nullable<TriggerUserPipelineResponse>;
  pipelineOpenAPISchema: Nullable<OpenAPIV3.Document>;
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
  updateSelectedConnectorNodeId: (
    fn: (prev: Nullable<string>) => Nullable<string>
  ) => void;
  updateConnectorFormIsDirty: (fn: (prev: boolean) => boolean) => void;
  updateSelectResourceDialogIsOpen: (fn: (prev: boolean) => boolean) => void;
  updateExpandAllNodes: (fn: (prev: boolean) => boolean) => void;
  updateTestModeEnabled: (fn: (prev: boolean) => boolean) => void;
  updateTestModeTriggerResponse: (
    fn: (
      prev: Nullable<TriggerUserPipelineResponse>
    ) => Nullable<TriggerUserPipelineResponse>
  ) => void;

  updatePipelineOpenAPISchema: (
    fn: (prev: Nullable<OpenAPIV3.Document>) => Nullable<OpenAPIV3.Document>
  ) => void;
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
  selectedConnectorNodeId: null,
  connectorFormIsDirty: false,
  selectResourceDialogIsOpen: false,
  expandAllNodes: false,
  testModeEnabled: false,
  testModeTriggerResponse: null,
  pipelineOpenAPISchema: null,
};

export const usePipelineBuilderStore = create<PipelineBuilderStore>()(
  devtools((set, get) => ({
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
    updateSelectedConnectorNodeId: (
      fn: (prev: Nullable<string>) => Nullable<string>
    ) =>
      set((state) => {
        return {
          ...state,
          selectedConnectorNodeId: fn(state.selectedConnectorNodeId),
        };
      }),
    updateConnectorFormIsDirty: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          connectorFormIsDirty: fn(state.connectorFormIsDirty),
        };
      }),
    updateSelectResourceDialogIsOpen: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          selectResourceDialogIsOpen: fn(state.selectResourceDialogIsOpen),
        };
      }),
    updateExpandAllNodes: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          expandAllNodes: fn(state.expandAllNodes),
        };
      }),
    updateTestModeEnabled: (fn: (prev: boolean) => boolean) =>
      set((state) => {
        return {
          ...state,
          testModeEnabled: fn(state.testModeEnabled),
        };
      }),
    updateTestModeTriggerResponse: (
      fn: (
        prev: Nullable<TriggerUserPipelineResponse>
      ) => Nullable<TriggerUserPipelineResponse>
    ) =>
      set((state) => {
        return {
          ...state,
          testModeTriggerResponse: fn(state.testModeTriggerResponse),
        };
      }),

    updatePipelineOpenAPISchema: (
      fn: (prev: Nullable<OpenAPIV3.Document>) => Nullable<OpenAPIV3.Document>
    ) =>
      set((state) => {
        return {
          ...state,
          pipelineOpenAPISchema: fn(state.pipelineOpenAPISchema),
        };
      }),
  }))
);
