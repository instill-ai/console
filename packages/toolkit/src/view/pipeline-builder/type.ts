/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  Nullable,
  PipelineConnectorComponent,
  PipelineEndComponent,
  PipelineRecipe,
  PipelineStartComponent,
  PipelineOperatorComponent,
} from "../../lib";

export type ConnectorNodeData = {
  nodeType: "connector";
  component: PipelineConnectorComponent;
  note: Nullable<string>;
};

export type EmptyNodeData = {
  nodeType: "empty";
  component: null;
  note: null;
};

export type StartNodeData = {
  nodeType: "start";
  component: PipelineStartComponent;
  note: Nullable<string>;
};

export type EndNodeData = {
  nodeType: "end";
  component: PipelineEndComponent;
  note: Nullable<string>;
};

export type OperatorNodeData = {
  nodeType: "operator";
  component: PipelineOperatorComponent;
  note: Nullable<string>;
};

export type NodeData =
  | ConnectorNodeData
  | EmptyNodeData
  | StartNodeData
  | EndNodeData
  | OperatorNodeData;

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
