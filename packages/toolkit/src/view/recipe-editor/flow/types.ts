import type {
  Nullable,
  PipelineGeneralComponent,
  PipelineIteratorComponent,
  PipelineOutputFieldMap,
  PipelineRunOnEventItem,
  PipelineVariableFieldMap,
} from "instill-sdk";

export type VariableNodeData = PipelineVariableFieldMap;

export type OutputNodeData = PipelineOutputFieldMap;

export type GeneralNodeData = PipelineGeneralComponent;

export type IteratorNodeData = PipelineIteratorComponent;

export type RunOnEventNodeData = PipelineRunOnEventItem;

export type NodeData =
  | VariableNodeData
  | OutputNodeData
  | GeneralNodeData
  | IteratorNodeData
  | RunOnEventNodeData;

export type ReferenceValueSet = {
  withoutCurlyBraces: string;
  withCurlyBraces: string;
};

export type InstillReference = {
  originalValue: string;
  referenceValue: ReferenceValueSet;
};

export type InstillReferenceWithID = InstillReference & {
  id: string;
};

export type PipelineMetadata = {
  component: PipelineComponentMetadataMap;
};

export type PipelineComponentMetadataMap = Record<
  string,
  PipelineComponentMetadata
>;

export type PipelineComponentMetadata = {
  x: number;
  y: number;
  note: Nullable<string>;
};
