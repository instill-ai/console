/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  Nullable,
  PipelineRecipe,
  PipelineIteratorComponent,
  GeneralRecord,
  PipelineVariableFieldMap,
  PipelineOutputFieldMap,
  PipelineGeneralComponent,
} from "../../lib";

export type TriggerNodeData = {
  note: Nullable<string>;
  metadata?: GeneralRecord;
  fields: PipelineVariableFieldMap;
};

export type ResponseNodeData = {
  note: Nullable<string>;
  metadata?: GeneralRecord;
  fields: PipelineOutputFieldMap;
};

export type GeneralNodeData = {
  note: Nullable<string>;
} & PipelineGeneralComponent;

export type IteratorNodeData = {
  note: Nullable<string>;
} & PipelineIteratorComponent;

export type NodeData =
  | TriggerNodeData
  | ResponseNodeData
  | GeneralNodeData
  | IteratorNodeData;

export type PipelineComponentReference =
  | DoubleCurlyBraceReference
  | SingleCurlyBraceReference;

export type DoubleCurlyBraceReference = {
  type: "doubleCurlyBrace";
  path: string;
  originalValue: string;
  referenceValues: ReferenceValueSet[];
  nodeId: Nullable<string>;
};

export type ReferenceValueSet = {
  withoutCurlyBraces: string;
  withCurlyBraces: string;
};

export type SingleCurlyBraceReference = {
  type: "singleCurlyBrace";
  path: string;
  originalValue: string;
  referenceValue: ReferenceValueSet;
  nodeId: Nullable<string>;
};

export type PipelineTemplate = {
  id: string;
  category: string;
  description: string;
  recipe: PipelineRecipe;
  author: string;
};

export type PipelineTemplatesByCategory = Record<string, PipelineTemplate[]>;

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

export type InstillReference = {
  originalValue: string;
  referenceValue: ReferenceValueSet;
};
