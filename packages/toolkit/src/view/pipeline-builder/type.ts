/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  Nullable,
  PipelineConnectorComponent,
  PipelineEndComponent,
  PipelineRecipe,
  PipelineStartComponent,
} from "../../lib";

export type ConnectorNodeData = {
  nodeType: "connector";
  component: PipelineConnectorComponent;
};

export type EmptyNodeData = {
  nodeType: "empty";
  component: null;
};

export type StartNodeData = {
  nodeType: "start";
  component: PipelineStartComponent;
};

export type EndNodeData = {
  nodeType: "end";
  component: PipelineEndComponent;
};

export type NodeData =
  | ConnectorNodeData
  | EmptyNodeData
  | StartNodeData
  | EndNodeData;

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
