/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  Nullable,
  PipelineConnectorComponent,
  PipelineRecipe,
  PipelineOperatorComponent,
  PipelineIteratorComponent,
  GeneralRecord,
  PipelineTriggerRequestFields,
  PipelineTriggerResponseFields,
} from "../../lib";

export type ConnectorNodeData = {
  note: Nullable<string>;
} & PipelineConnectorComponent;

export type TriggerNodeData = {
  id: "trigger";
  note: Nullable<string>;
  metadata?: GeneralRecord;
  fields: PipelineTriggerRequestFields;
};

export type ResponseNodeData = {
  id: "response";
  note: Nullable<string>;
  metadata?: GeneralRecord;
  fields: PipelineTriggerResponseFields;
};

export type OperatorNodeData = {
  note: Nullable<string>;
} & PipelineOperatorComponent;

export type IteratorNodeData = {
  note: Nullable<string>;
} & PipelineIteratorComponent;

export type NodeData =
  | ConnectorNodeData
  | TriggerNodeData
  | ResponseNodeData
  | OperatorNodeData
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
  components: PipelineComponentMetadata[];
};

export type PipelineComponentMetadata = {
  id: string;
  x: number;
  y: number;
  note: Nullable<string>;
};

export type InstillReference = {
  originalValue: string;
  referenceValue: ReferenceValueSet;
};
