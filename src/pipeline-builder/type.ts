import {
  ConnectorWithWatchState,
  Nullable,
  Pipeline,
  PipelineState,
} from "@instill-ai/toolkit";
import * as z from "zod";

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

export const PipelineStartComponentSchema = z.object({
  id: z.literal("start"),
  resource_name: z.string(),
  resource_detail: z.nullable(z.record(z.any())),
  definition_name: z.string(),
  definition_detail: z.record(z.any()),
  type: z.enum([
    "COMPONENT_TYPE_CONNECTOR_AI",
    "COMPONENT_TYPE_CONNECTOR_DATA",
    "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN",
    "COMPONENT_TYPE_OPERATOR",
  ]),
  configuration: z.record(
    z.object({
      display_name: z.string(),
      type: z.string(),
    })
  ),
});

export type PipelineStartComponent = z.infer<
  typeof PipelineStartComponentSchema
>;

export const PipelineEndComponentSchema = z.object({
  id: z.literal("end"),
  resource_name: z.string(),
  resource_detail: z.nullable(z.record(z.any())),
  definition_name: z.string(),
  definition_detail: z.record(z.any()),
  type: z.enum([
    "COMPONENT_TYPE_CONNECTOR_AI",
    "COMPONENT_TYPE_CONNECTOR_DATA",
    "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN",
    "COMPONENT_TYPE_OPERATOR",
  ]),
  configuration: z.record(
    z.object({
      display_name: z.string(),
      type: z.string(),
    })
  ),
});

export type PipelineEndComponent = z.infer<typeof PipelineEndComponentSchema>;

export const PipelineConnectorComponentSchema = z.object({
  id: z.string(),
  resource_name: z.string(),
  resource_detail: z.record(z.any()),
  type: z.enum([
    "COMPONENT_TYPE_CONNECTOR_AI",
    "COMPONENT_TYPE_CONNECTOR_DATA",
    "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN",
    "COMPONENT_TYPE_OPERATOR",
  ]),
  definition_name: z.string(),
  definition_detail: z.record(z.any()),
  configuration: z.record(z.any()),
});

export type PipelineConnectorComponent = z.infer<
  typeof PipelineConnectorComponentSchema
>;

export type PipelineComponent = PipelineStartComponent | PipelineEndComponent;

export type NewPipeline = Omit<Pipeline, "recipe"> & {
  recipe: {
    version: string;
    components: PipelineComponent[];
  };
};

export type NewPipelineWithWatchState = {
  watchState: PipelineState;
} & NewPipeline;
