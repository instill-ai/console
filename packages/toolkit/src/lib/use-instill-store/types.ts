import { NodeData } from "../../view";
import { Nullable } from "../type";
import {
  ConnectorDefinition,
  ConnectorResourceType,
  ConnectorResourceWithDefinition,
} from "../vdp-sdk/connector";
import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";
import { TriggerUserPipelineResponse } from "../vdp-sdk/pipeline";
import { SmartHint } from "../use-smart-hint";
import { InstillJSONSchema } from "../use-instill-form";

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
  pipelineOpenAPIOutputSchema: Nullable<InstillJSONSchema>;
  accessToken: Nullable<string>;
  createResourceDialogState: PipelineBuilderCreateResourceDialogState;
  currentVersion: Nullable<string>;
  initializedByTemplateOrClone: boolean;
  isOwner: boolean;
};

export type PipelineBuilderAction = {
  initPipelineBuilder: () => void;
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
  updatePipelineOpenAPIOutputSchema: (
    fn: (prev: Nullable<InstillJSONSchema>) => Nullable<InstillJSONSchema>
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

export type PipelineBuilderSlice = PipelineBuilderState & PipelineBuilderAction;

export type SmartHintSlice = {
  smartHints: SmartHint[];
  updateSmartHints: (fn: (prev: SmartHint[]) => SmartHint[]) => void;
};

export type InstillStore = SmartHintSlice & PipelineBuilderSlice;

export type InstillStoreMutators = [
  ["zustand/devtools", never],
  ["zustand/subscribeWithSelector", never],
];
