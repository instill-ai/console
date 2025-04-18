import {
  TriggerNamespacePipelineResponse,
  TriggerUserPipelineWithStreamData,
} from "instill-sdk";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";
import { StateCreator } from "zustand";

import { NodeData } from "../../view";
import { Nullable } from "../type";
import { InstillJSONSchema } from "../use-instill-form";
import {
  InstillStore,
  InstillStoreMutators,
  PipelineBuilderSlice,
  PipelineBuilderState,
  WarnUnsavedChangesDialogState,
} from "./types";

export const pipelineBuilderInitialState: PipelineBuilderState = {
  pipelineId: null,
  pipelineName: null,
  nodes: [],
  edges: [],
  isSavingPipeline: false,
  rightPanelIsOpen: false,
  pipelineRecipeIsDirty: false,
  pipelineIsNew: false,
  selectedConnectorNodeId: null,
  connectorFormIsDirty: false,
  selectResourceDialogIsOpen: false,
  currentAdvancedConfigurationNodeID: null,
  collapseAllNodes: false,
  testModeTriggerResponse: null,
  pipelineOpenAPIOutputSchema: null,
  currentVersion: null,
  initializedByTemplateOrClone: false,
  isOwner: false,
  isTriggeringPipeline: false,
  dialogPublishPipelineIsOpen: false,
  dialogSharePipelineIsOpen: false,
  pipelineIsReadOnly: false,
  isEditingIterator: false,
  tempSavedNodesForEditingIteratorFlow: [],
  editingIteratorID: null,
  warnUnsavedChangesDialogState: {
    open: false,
    confirmNavigation: null,
  },
  triggerWithStreamData: [],
  displayEventNodes: false,
};

export const createPipelineBuilderSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  PipelineBuilderSlice
> = (set, get) => ({
  ...pipelineBuilderInitialState,
  initIteratorRelatedState: () =>
    set((state) => {
      return {
        ...state,
        isEditingIterator: false,
        editingIteratorID: null,
        tempSavedNodesForEditingIteratorFlow: [],
      };
    }),
  initPipelineBuilder: () => set(() => pipelineBuilderInitialState),
  updatePipelineId: (fn: (prev: Nullable<string>) => Nullable<string>) =>
    set((state) => {
      return { ...state, pipelineId: fn(state.pipelineId) };
    }),
  updatePipelineName: (fn: (prev: Nullable<string>) => Nullable<string>) =>
    set((state) => {
      return { ...state, pipelineName: fn(state.pipelineName) };
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
        get().edges,
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
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) =>
    set((state) => {
      return {
        ...state,
        selectedConnectorNodeId: fn(state.selectedConnectorNodeId),
      };
    }),
  updateCurrentAdvancedConfigurationNodeID: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) =>
    set((state) => {
      return {
        ...state,
        currentAdvancedConfigurationNodeID: fn(
          state.currentAdvancedConfigurationNodeID,
        ),
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
  updateCollapseAllNodes: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        collapseAllNodes: fn(state.collapseAllNodes),
      };
    }),
  updateTestModeTriggerResponse: (
    fn: (
      prev: Nullable<TriggerNamespacePipelineResponse>,
    ) => Nullable<TriggerNamespacePipelineResponse>,
  ) =>
    set((state) => {
      return {
        ...state,
        testModeTriggerResponse: fn(state.testModeTriggerResponse),
      };
    }),

  updatePipelineOpenAPIOutputSchema: (
    fn: (prev: Nullable<InstillJSONSchema>) => Nullable<InstillJSONSchema>,
  ) =>
    set((state) => {
      return {
        ...state,
        pipelineOpenAPIOutputSchema: fn(state.pipelineOpenAPIOutputSchema),
      };
    }),
  updateCurrentVersion: (fn: (prev: Nullable<string>) => Nullable<string>) =>
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
        initializedByTemplateOrClone: fn(state.initializedByTemplateOrClone),
      };
    }),
  updateIsOwner: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        isOwner: fn(state.isOwner),
      };
    }),
  updateIsTriggeringPipeline: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        isTriggeringPipeline: fn(state.isTriggeringPipeline),
      };
    }),
  updateDialogPublishPipelineIsOpen: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        dialogPublishPipelineIsOpen: fn(state.dialogPublishPipelineIsOpen),
      };
    }),
  updateDialogSharePipelineIsOpen: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        dialogSharePipelineIsOpen: fn(state.dialogSharePipelineIsOpen),
      };
    }),
  updatePipelineIsReadOnly: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        pipelineIsReadOnly: fn(state.pipelineIsReadOnly),
      };
    }),
  updateIsEditingIterator: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        isEditingIterator: fn(state.isEditingIterator),
      };
    }),
  updateTempSavedNodesForEditingIteratorFlow: (
    fn: (prev: Node<NodeData>[]) => Node<NodeData>[],
  ) =>
    set((state) => {
      return {
        ...state,
        tempSavedNodesForEditingIteratorFlow: fn(
          state.tempSavedNodesForEditingIteratorFlow,
        ),
      };
    }),
  updateEditingIteratorID: (fn: (prev: Nullable<string>) => Nullable<string>) =>
    set((state) => {
      return {
        ...state,
        editingIteratorID: fn(state.editingIteratorID),
      };
    }),
  updateWarnUnsavdChangesDialogState: (
    fn: (prev: WarnUnsavedChangesDialogState) => WarnUnsavedChangesDialogState,
  ) =>
    set((state) => {
      return {
        ...state,
        warnUnsavedChangesDialogState: fn(state.warnUnsavedChangesDialogState),
      };
    }),
  updateTriggerWithStreamData: (
    fn: (
      prev: TriggerUserPipelineWithStreamData[],
    ) => TriggerUserPipelineWithStreamData[],
  ) =>
    set((state) => {
      return {
        ...state,
        triggerWithStreamData: fn(state.triggerWithStreamData),
      };
    }),
  updateDisplayEventNodes: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        displayEventNodes: fn(state.displayEventNodes),
      };
    }),
});
