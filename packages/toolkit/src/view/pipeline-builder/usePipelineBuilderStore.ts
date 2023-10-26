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
import { subscribeWithSelector, devtools } from "zustand/middleware";

import { NodeData } from "./type";
import { OpenAPIV3 } from "openapi-types";
import {
  ConnectorDefinition,
  ConnectorResourceType,
  ConnectorResourceWithDefinition,
  Nullable,
  TriggerUserPipelineResponse,
} from "../../lib";

export type PipelineBuilderCreateResourceDialogState = {
  open: boolean;
  connectorType: Nullable<ConnectorResourceType>;
  connectorDefinition: Nullable<ConnectorDefinition>;
  onCreated: Nullable<
    (connectorResource: ConnectorResourceWithDefinition) => void
  >;
  onSelectedExistingResource: Nullable<
    (connectorResource: ConnectorResourceWithDefinition) => void
  >;
};

export type PipelineBuilderState = {
  pipelineUid: Nullable<string>;
  pipelineId: Nullable<string>;
  pipelineName: Nullable<string>;
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
  accessToken: Nullable<string>;
  createResourceDialogState: PipelineBuilderCreateResourceDialogState;
  currentVersion: Nullable<string>;
  initializedByTemplateOrClone: boolean;
  isOwner: boolean;
};

export type PipelineBuilderAction = {
  init: () => void;
  setPipelineUid: (pipelineUid: Nullable<string>) => void;
  setPipelineId: (pipelineId: Nullable<string>) => void;
  setPipelineName: (pipelineName: Nullable<string>) => void;
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
  updateAccessToken: (fn: (prev: Nullable<string>) => Nullable<string>) => void;
  updateCreateResourceDialogState: (
    fn: (
      prev: PipelineBuilderCreateResourceDialogState
    ) => PipelineBuilderCreateResourceDialogState
  ) => void;
  updateCurrentVersion: (
    fn: (prev: Nullable<string>) => Nullable<string>
  ) => void;
  updateInitializedByTemplateOrClone: (fn: (prev: boolean) => boolean) => void;
  updateIsOwner: (fn: (prev: boolean) => boolean) => void;
};

export type PipelineBuilderStore = PipelineBuilderState & PipelineBuilderAction;

export const pipelineBuilderInitialState: PipelineBuilderState = {
  pipelineId: null,
  pipelineName: null,
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
  accessToken: null,
  createResourceDialogState: {
    open: false,
    connectorType: null,
    connectorDefinition: null,
    onCreated: null,
    onSelectedExistingResource: null,
  },
  currentVersion: null,
  initializedByTemplateOrClone: false,
  isOwner: false,
};

export const usePipelineBuilderStore = create<PipelineBuilderStore>()(
  subscribeWithSelector(
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
      setPipelineName: (pipelineName: Nullable<string>) =>
        set((state) => {
          return { ...state, pipelineName };
        }),
      setPipelineDescription: (pipelineDescription: Nullable<string>) =>
        set((state) => {
          return { ...state, pipelineDescription };
        }),
      updateRightPanelIsOpen: (fn: (prev: boolean) => boolean) =>
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
      updateAccessToken: (fn: (prev: Nullable<string>) => Nullable<string>) =>
        set((state) => {
          return {
            ...state,
            accessToken: fn(state.accessToken),
          };
        }),
      updateCreateResourceDialogState: (
        fn: (
          prev: PipelineBuilderCreateResourceDialogState
        ) => PipelineBuilderCreateResourceDialogState
      ) =>
        set((state) => {
          return {
            ...state,
            createResourceDialogState: fn(state.createResourceDialogState),
          };
        }),
      updateCurrentVersion: (
        fn: (prev: Nullable<string>) => Nullable<string>
      ) =>
        set((state) => {
          return {
            ...state,
            currentVersion: fn(state.currentVersion),
          };
        }),
      updateInitializedByTemplateOrClone: (fn: (prev: boolean) => boolean) =>
        set((state) => {
          return {
            ...state,
            initializedByTemplateOrClone: fn(
              state.initializedByTemplateOrClone
            ),
          };
        }),
      updateIsOwner: (fn: (prev: boolean) => boolean) =>
        set((state) => {
          return {
            ...state,
            isOwner: fn(state.isOwner),
          };
        }),
    }))
  )
);
