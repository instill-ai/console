import type {
  Citation,
  GeneralRecord,
  PipelineStreamStatus,
  Secret,
  TriggerNamespacePipelineResponse,
  TriggerUserPipelineWithStreamData,
} from "instill-sdk";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
} from "reactflow";

import { NodeData } from "../../view";
import { EditorRecipeUpdater } from "../../view/recipe-editor/lib";
import { Nullable } from "../type";
import { InstillJSONSchema } from "../use-instill-form";
import { SmartHint } from "../use-smart-hint";

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
  testModeTriggerResponse: Nullable<TriggerNamespacePipelineResponse>;
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
  triggerWithStreamData: TriggerUserPipelineWithStreamData[];
  displayEventNodes: boolean;
};

export type PipelineBuilderAction = {
  initPipelineBuilder: () => void;
  initIteratorRelatedState: () => void;
  updatePipelineId: (fn: (prev: Nullable<string>) => Nullable<string>) => void;
  updatePipelineName: (
    fn: (prev: Nullable<string>) => Nullable<string>,
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
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  updateCurrentAdvancedConfigurationNodeID: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  updateConnectorFormIsDirty: (fn: (prev: boolean) => boolean) => void;
  updateSelectResourceDialogIsOpen: (fn: (prev: boolean) => boolean) => void;
  updateCollapseAllNodes: (fn: (prev: boolean) => boolean) => void;
  updateTestModeTriggerResponse: (
    fn: (
      prev: Nullable<TriggerNamespacePipelineResponse>,
    ) => Nullable<TriggerNamespacePipelineResponse>,
  ) => void;
  updatePipelineOpenAPIOutputSchema: (
    fn: (prev: Nullable<InstillJSONSchema>) => Nullable<InstillJSONSchema>,
  ) => void;

  updateCurrentVersion: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  updateInitializedByTemplateOrClone: (fn: (prev: boolean) => boolean) => void;
  updateIsOwner: (fn: (prev: boolean) => boolean) => void;
  updateIsTriggeringPipeline: (fn: (prev: boolean) => boolean) => void;
  updateDialogPublishPipelineIsOpen: (fn: (prev: boolean) => boolean) => void;
  updateDialogSharePipelineIsOpen: (fn: (prev: boolean) => boolean) => void;
  updatePipelineIsReadOnly: (fn: (prev: boolean) => boolean) => void;
  updateIsEditingIterator: (fn: (prev: boolean) => boolean) => void;
  updateTempSavedNodesForEditingIteratorFlow: (
    fn: (prev: Node<NodeData>[]) => Node<NodeData>[],
  ) => void;
  updateEditingIteratorID: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  updateWarnUnsavdChangesDialogState: (
    fn: (prev: WarnUnsavedChangesDialogState) => WarnUnsavedChangesDialogState,
  ) => void;
  updateTriggerWithStreamData: (
    fn: (
      prev: TriggerUserPipelineWithStreamData[],
    ) => TriggerUserPipelineWithStreamData[],
  ) => void;
  updateDisplayEventNodes: (fn: (prev: boolean) => boolean) => void;
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

  navigationNamespaceAnchor: Nullable<string>;
  updateNavigationNamespaceAnchor: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
};
export enum DefaultEditorViewIDs {
  MAIN_PREVIEW_FLOW,
  MAIN_INPUT,
  MAIN_OUTPUT,
  GETTING_STARTED,
}

export type EditorViewID = string | DefaultEditorViewIDs;

export type EditorViewType = "preview" | "docs" | "input" | "output";

export type EditorView = {
  id: EditorViewID;
  type: EditorViewType;
  view: React.ReactNode;
  title: string;
  closeable: boolean;
};

export type EditorViewSection = {
  views: EditorView[];
  currentViewId: Nullable<EditorViewID>;
};

export type EditorMultiScreenModel = {
  main: EditorViewSection;
  topRight: EditorViewSection;
  bottomRight: EditorViewSection;
};

export type EditorSlice = {
  openActionCmdk: boolean;
  updateOpenActionCmdk: (fn: (prev: boolean) => boolean) => void;
  openComponentCmdo: boolean;
  updateOpenComponentCmdo: (fn: (prev: boolean) => boolean) => void;
  selectedComponentId: Nullable<string>;
  updateSelectedComponentId: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  editorRef: Nullable<editor.IStandaloneCodeEditor>;
  updateEditorRef: (
    fn: (
      prev: Nullable<editor.IStandaloneCodeEditor>,
    ) => Nullable<editor.IStandaloneCodeEditor>,
  ) => void;
  monacoRef: Nullable<Monaco>;
  updateMonacoRef: (fn: (prev: Nullable<Monaco>) => Nullable<Monaco>) => void;

  /**
   * We use this value to control the multile screen editor
   */
  editorMultiScreenModel: EditorMultiScreenModel;
  updateEditorMultiScreenModel: (
    fn: (prev: EditorMultiScreenModel) => EditorMultiScreenModel,
  ) => void;

  /**
   * This is used to store the react flow instance for the editor preview
   * You can control the react flow instance via this instance
   */
  editorPreviewReactFlowInstance: Nullable<ReactFlowInstance>;
  updateEditorPreviewReactFlowInstance: (
    fn: (prev: Nullable<ReactFlowInstance>) => Nullable<ReactFlowInstance>,
  ) => void;
  /**
   * This value is only for caching the user input in the editor.
   *
   * Don't use this to update the raw value of the editor. If it is for actions like
   * adding a new component, updating a component, etc, use the respective actions
   * from the monaco-editor to have history record for undo/redo.
   * @returns void
   */
  rawRecipeOnDom: Nullable<string>;
  updateRawRecipeOnDom: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  isSavingRecipe: boolean;
  updateIsSavingRecipe: (fn: (prev: boolean) => boolean) => void;
  hasUnsavedRecipe: boolean;
  updateHasUnsavedRecipe: (fn: (prev: boolean) => boolean) => void;

  /**
   * This is used to trigger the import recipe file uploader
   * Once this is triggered and the user select the desired file,
   * The import recipe dialog will be opened and the file will be read
   */
  importRecipeInputTriggerRef: React.MutableRefObject<HTMLInputElement>;

  /**
   * This is used to store the pipeline and component status, input, output, and error
   * for the trigger pipeline stream
   */
  triggerPipelineStreamMap: Nullable<TriggerPipelineStreamMap>;
  updateTriggerPipelineStreamMap: (
    fn: (
      prev: Nullable<TriggerPipelineStreamMap>,
    ) => Nullable<TriggerPipelineStreamMap>,
  ) => void;

  /**
   * This is the ref for run button
   * You can use this ref to click the run button and then trigger the pipeline
   */
  runButtonRef: React.MutableRefObject<HTMLButtonElement>;
  updateRunButtonRef: (
    fn: (
      prev: React.MutableRefObject<HTMLButtonElement>,
    ) => React.MutableRefObject<HTMLButtonElement>,
  ) => void;

  /**
   * This is the returned of useDebouncedRecipeUpdater, we store it in the store
   * due to we might want to cancel or flush all the debounce invokion like when
   * user force saved using autonomousRecipeUpdater
   */
  editorDebouncedRecipeUpdater: Nullable<EditorRecipeUpdater>;
  updateEditorDebouncedRecipeUpdater: (
    fn: (prev: Nullable<EditorRecipeUpdater>) => Nullable<EditorRecipeUpdater>,
  ) => void;

  /**
   * This is to control the flow's control is under demo mode or not
   * When in the editor, it will be false
   * When in the pipeline preview, it will be true
   */
  flowIsUnderDemoMode: boolean;
  updateFlowIsUnderDemoMode: (fn: (prev: boolean) => boolean) => void;
};

export type FeatureFlagSlice = {
  featureFlagChatEnabled: boolean;
  updateFeatureFlagChatEnabled: (fn: (prev: boolean) => boolean) => void;
};

export type TriggerPipelineStreamMap = {
  component?: Record<
    string,
    {
      status?: PipelineStreamStatus;
      input?: GeneralRecord;
      output?: GeneralRecord;
      error?: GeneralRecord;
    }
  >;
  pipeline?: {
    status?: PipelineStreamStatus;
    output?: GeneralRecord;
    error?: GeneralRecord;
  };
};

export type RecentlyUsedSlice = {
  recentlyUsedStartComponentFieldTypes: string[];
  updateRecentlyUsedStartComponentFieldTypes: (
    fn: (prev: string[]) => string[],
  ) => void;
};

export type InstillChatAgentStatus = Nullable<{
  content?: string;
  createTime: string;
}>;

export type InstillChatError = Nullable<{
  content?: string;
  createTime: string;
}>;

export type ChatDrawerType = Nullable<"files" | "citations">;

export type ChatSlice = {
  enabledTools: string[];
  updateEnabledTools: (fn: (prev: string[]) => string[]) => void;
  enableToolSuggestion: boolean;
  updateEnableToolSuggestion: (fn: (prev: boolean) => boolean) => void;
  chatFullscreenOpen: boolean;
  updateChatFullscreenOpen: (fn: (prev: boolean) => boolean) => void;
  chatDrawerType: ChatDrawerType;
  updateChatDrawerType: (fn: (prev: ChatDrawerType) => ChatDrawerType) => void;
  isWebSearchEnabled: boolean;
  updateIsWebSearchEnabled: (fn: (prev: boolean) => boolean) => void;
  chatStreamIsActive: Record<string, boolean>;
  updateChatStreamIsActive: (
    fn: (prev: Record<string, boolean>) => Record<string, boolean>,
  ) => void;
  chatIsBusy: Record<string, boolean>;
  updateChatIsBusy: (
    fn: (prev: Record<string, boolean>) => Record<string, boolean>,
  ) => void;
  isTableUpdated: Record<string, boolean>;
  updateIsTableUpdated: (
    fn: (prev: Record<string, boolean>) => Record<string, boolean>,
  ) => void;
  chatAgentStatus: Record<string, InstillChatAgentStatus>;
  updateChatAgentStatus: (
    fn: (
      prev: Record<string, InstillChatAgentStatus>,
    ) => Record<string, InstillChatAgentStatus>,
  ) => void;
  chatError: Record<string, InstillChatAgentStatus>;
  updateChatError: (
    fn: (
      prev: Record<string, InstillChatAgentStatus>,
    ) => Record<string, InstillChatAgentStatus>,
  ) => void;
  currentActiveCitationListInTheRightDrawer: Record<string, Citation[]>;
  updateCurrentActiveCitationListInTheRightDrawer: (
    fn: (prev: Record<string, Citation[]>) => Record<string, Citation[]>,
  ) => void;
  uploadFilesPending: Record<string, PendingFile[]>;
  updateUploadFilesPending: (
    fn: (prev: Record<string, PendingFile[]>) => Record<string, PendingFile[]>,
  ) => void;
  tempFileCatalogId: Nullable<string>;
  updateTempFileCatalogId: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  chatMessageTableUids: Record<string, string[]>;
  updateChatMessageTableUids: (
    fn: (prev: Record<string, string[]>) => Record<string, string[]>,
  ) => void;
};

export type TableMode = "table" | "preview";

export type CurrentTableSort = {
  columnUid: string;
  direction: "asc" | "desc";
};

export type CurrentCellPreviewAnchor = {
  rowUid: string;
  columnUid: string;
};

export type TableSlice = {
  leftSidebarOpen: boolean;
  updateLeftSidebarOpen: (fn: (prev: boolean) => boolean) => void;
  rightSidebarOpen: boolean;
  updateRightSidebarOpen: (fn: (prev: boolean) => boolean) => void;
  tableMode: TableMode;
  updateTableMode: (fn: (prev: TableMode) => TableMode) => void;
  currentTablePreviewRowUid: Nullable<string>;
  updateCurrentTablePreviewRowUid: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  currentTableSort: Nullable<CurrentTableSort>;
  updateCurrentTableSort: (
    fn: (prev: Nullable<CurrentTableSort>) => Nullable<CurrentTableSort>,
  ) => void;
  currentCellPreviewAnchor: Nullable<CurrentCellPreviewAnchor>;
  updateCurrentCellPreviewAnchor: (
    fn: (
      prev: Nullable<CurrentCellPreviewAnchor>,
    ) => Nullable<CurrentCellPreviewAnchor>,
  ) => void;
  forceOpenNewlyCreatedColumnContextMenuColumnUid: Nullable<string>;
  updateForceOpenNewlyCreatedColumnContextMenuColumnUid: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
  currentSelectedTableRowsUid: string[];
  updateCurrentSelectedTableRowsUid: (fn: (prev: string[]) => string[]) => void;
  currentLeftPanelEditingColumnUid: Nullable<string>;
  updateCurrentLeftPanelEditingColumnUid: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) => void;
};

export type InstillStore = SmartHintSlice &
  PipelineBuilderSlice &
  GeneralSlice &
  RecentlyUsedSlice &
  EditorSlice &
  FeatureFlagSlice &
  ChatSlice &
  TableSlice;

export type InstillStoreMutators = [
  ["zustand/devtools", never],
  ["zustand/subscribeWithSelector", never],
];

export type PendingFile = {
  name: string;
  progress: number;
  status: "uploading" | "success" | "error";
  type: string;
  objectUid?: string;
  size: number;
};
