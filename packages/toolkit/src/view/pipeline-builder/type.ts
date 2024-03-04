/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  Nullable,
  PipelineConnectorComponent,
  PipelineEndComponent,
  PipelineRecipe,
  PipelineStartComponent,
  PipelineOperatorComponent,
  PipelineIteratorComponent,
} from "../../lib";

export type ConnectorNodeData = {
  note: Nullable<string>;
} & PipelineConnectorComponent;

export type StartNodeData = {
  note: Nullable<string>;
} & PipelineStartComponent;

export type EndNodeData = {
  note: Nullable<string>;
} & PipelineEndComponent;

export type OperatorNodeData = {
  note: Nullable<string>;
} & PipelineOperatorComponent;

export type IteratorNodeData = {
  note: Nullable<string>;
} & PipelineIteratorComponent;

export type NodeData =
  | ConnectorNodeData
  | StartNodeData
  | EndNodeData
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
