import {
  ConnectorDefinition,
  ConnectorResource,
  Nullable,
  OperatorDefinition,
} from "@instill-ai/toolkit";

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

export type ComponentInputField = {
  display_name: string;
  type: string;
};

export type PipelineStartComponent = {
  id: "start";
  resource_name: string;
  resource: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  operator_definition: Nullable<OperatorDefinition>;
  configuration: Record<string, Record<string, StartOperatorInput>>;
};

export type PipelineEndComponent = {
  id: "end";
  resource_name: string;
  resource: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  operator_definition: Nullable<OperatorDefinition>;
  configuration: Record<string, Record<string, any>>;
};

export type PipelineComponentType =
  | "COMPONENT_TYPE_CONNECTOR_AI"
  | "COMPONENT_TYPE_CONNECTOR_DATA"
  | "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN"
  | "COMPONENT_TYPE_OPERATOR"
  | "COMPONENT_TYPE_UNSPECIFIED";

export type PipelineConnectorComponent = {
  id: string;
  resource_name: string;
  resource: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  connector_definition: Nullable<ConnectorDefinition>;
  configuration: Record<string, any>;
};

export type PipelineComponent =
  | PipelineStartComponent
  | PipelineEndComponent
  | PipelineConnectorComponent;

export type StartOperatorBody = Record<string, StartOperatorInput>;

export type StartOperatorInputBodyValue = Record<string, any>;

export type StartOperatorInput = {
  title: string;
  type: StartOperatorInputType;
};

export type StartOperatorInputType =
  | StartOperatorInputSingularType
  | StartOperatorInputArrayType;

export type StartOperatorInputSingularType =
  | "text"
  | "number"
  | "boolean"
  | "audio"
  | "image";

export type StartOperatorInputArrayType =
  | "text_array"
  | "number_array"
  | "boolean_array"
  | "audio_array"
  | "image_array";
