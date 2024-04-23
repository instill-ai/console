import { NodeData } from "../../view";
import { Nullable } from "../type";
import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";
import { Secret, TriggerUserPipelineResponse } from "../vdp-sdk/pipeline";
import { SmartHint } from "../use-smart-hint";
import { InstillJSONSchema } from "../use-instill-form";

export type WarnUnsavedChangesDialogState = {
  open: boolean;
  confirmNavigation: Nullable<() => void>;
};

export type PipelineBuilderState = {
  pipelineId: Nullable<string>;
  pipelineName: Nullable<string>;
  nodes: Node<NodeData>[];
  edges: Edge[];
  rightPanelIsOpen: boolean;
  isSavingPipeline: boolean;
  pipelineRecipeIsDirty: boolean;
  pipelineIsNew: boolean;
  selectedConnectorNodeId: Nullable<string>;
  currentAdvancedConfigurationNodeID: Nullable<string>;
  connectorFormIsDirty: boolean;
  selectResourceDialogIsOpen: boolean;
  collapseAllNodes: boolean;
  testModeTriggerResponse: Nullable<TriggerUserPipelineResponse>;
  pipelineOpenAPIOutputSchema: Nullable<InstillJSONSchema>;
  currentVersion: Nullable<string>;
  initializedByTemplateOrClone: boolean;
  isOwner: boolean;
  isTriggeringPipeline: boolean;
  dialogPublishPipelineIsOpen: boolean;
  dialogSharePipelineIsOpen: boolean;
  pipelineIsReadOnly: boolean;
  isEditingIterator: boolean;
  tempSavedNodesForEditingIteratorFlow: Node<NodeData>[];
  editingIteratorID: Nullable<string>;
  warnUnsavedChangesDialogState: WarnUnsavedChangesDialogState;
};

export type PipelineBuilderAction = {
  initPipelineBuilder: () => void;
  updatePipelineId: (fn: (prev: Nullable<string>) => Nullable<string>) => void;
  updatePipelineName: (
    fn: (prev: Nullable<string>) => Nullable<string>
  ) => void;
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
  updateCurrentAdvancedConfigurationNodeID: (
    fn: (prev: Nullable<string>) => Nullable<string>
  ) => void;
  updateConnectorFormIsDirty: (fn: (prev: boolean) => boolean) => void;
  updateSelectResourceDialogIsOpen: (fn: (prev: boolean) => boolean) => void;
  updateCollapseAllNodes: (fn: (prev: boolean) => boolean) => void;
  updateTestModeTriggerResponse: (
    fn: (
      prev: Nullable<TriggerUserPipelineResponse>
    ) => Nullable<TriggerUserPipelineResponse>
  ) => void;
  updatePipelineOpenAPIOutputSchema: (
    fn: (prev: Nullable<InstillJSONSchema>) => Nullable<InstillJSONSchema>
  ) => void;

  updateCurrentVersion: (
    fn: (prev: Nullable<string>) => Nullable<string>
  ) => void;
  updateInitializedByTemplateOrClone: (fn: (prev: boolean) => boolean) => void;
  updateIsOwner: (fn: (prev: boolean) => boolean) => void;
  updateIsTriggeringPipeline: (fn: (prev: boolean) => boolean) => void;
  updateDialogPublishPipelineIsOpen: (fn: (prev: boolean) => boolean) => void;
  updateDialogSharePipelineIsOpen: (fn: (prev: boolean) => boolean) => void;
  updatePipelineIsReadOnly: (fn: (prev: boolean) => boolean) => void;
  updateIsEditingIterator: (fn: (prev: boolean) => boolean) => void;
  updateTempSavedNodesForEditingIteratorFlow: (
    fn: (prev: Node<NodeData>[]) => Node<NodeData>[]
  ) => void;
  updateEditingIteratorID: (
    fn: (prev: Nullable<string>) => Nullable<string>
  ) => void;
  updateWarnUnsavdChangesDialogState: (
    fn: (prev: WarnUnsavedChangesDialogState) => WarnUnsavedChangesDialogState
  ) => void;
};

export type PipelineBuilderSlice = PipelineBuilderState & PipelineBuilderAction;

export type SmartHintSlice = {
  smartHints: SmartHint[];
  updateSmartHints: (fn: (prev: SmartHint[]) => SmartHint[]) => void;
};

export type GeneralSlice = {
  accessToken: Nullable<string>;
  updateAccessToken: (fn: (prev: Nullable<string>) => Nullable<string>) => void;
  enabledQuery: boolean;
  updateEnabledQuery: (fn: (prev: boolean) => boolean) => void;

  // This will store all the secrets current entity have access to
  // But due to backend won't return any sensitive information,
  // this is safe to do so
  entitySecrets: Secret[];
  updateEntitySecrets: (fn: (prev: Secret[]) => Secret[]) => void;
};

export type RecentlyUsedSlice = {
  recentlyUsedStartComponentFieldTypes: string[];
  updateRecentlyUsedStartComponentFieldTypes: (
    fn: (prev: string[]) => string[]
  ) => void;
};

export type InstillStore = SmartHintSlice &
  PipelineBuilderSlice &
  GeneralSlice &
  RecentlyUsedSlice;

export type InstillStoreMutators = [
  ["zustand/devtools", never],
  ["zustand/subscribeWithSelector", never],
];
