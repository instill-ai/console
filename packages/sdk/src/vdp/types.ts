/**
 * We use these types in both pipeline and release client, to avoid circular
 * dependency issue, we need to put the type and schema here
 */

import { z } from "zod";

import { DataSpecification, GeneralRecord, Nullable } from "../types";
import { ComponentDefinition } from "./component";

export type PipelineVariableField = {
  title: string;
  instillFormat: string;
  description?: string;
  instillUiOrder?: number;
  instillUiMultiline?: boolean;
};

export const PipelineVariableFieldSchema = z.object({
  title: z.string(),
  instillFormat: z.string(),
  description: z.string().optional(),
  instillUiOrder: z.number().optional(),
  instillUiMultiline: z.boolean().optional(),
});

export type PipelineVariableFieldMap = Record<
  string,
  Nullable<PipelineVariableField>
>;

export const PipelineVariableFieldMapSchema = z.record(
  PipelineVariableFieldSchema.nullable(),
);

export type PipelineOutputField = {
  title: string;
  description?: string;
  value: string;
  instillUiOrder?: number;
};

export const PipelineOutputFieldSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  value: z.string(),
  instillUiOrder: z.number().optional(),
});

export type PipelineOutputFieldMap = Record<
  string,
  Nullable<PipelineOutputField>
>;

export const PipelineOutputFieldMapSchema = z.record(
  PipelineOutputFieldSchema.nullable(),
);

export type ComponentBasicFields = {
  metadata?: GeneralRecord;
  type: string;
};

export type PipelineGeneralComponent = {
  definition?: Nullable<ComponentDefinition>;
  task: string;
  input: GeneralRecord;
  condition: Nullable<string>;
  setup: Nullable<GeneralRecord>;
  description?: string;
} & ComponentBasicFields;

export type PipelineIteratorComponent = {
  input: string;
  outputElements: Record<string, string>;
  component: PipelineComponentMap;
  condition: Nullable<string>;
  dataSpecification: Nullable<DataSpecification>;
  description?: string;
} & ComponentBasicFields;

export type PipelineComponent =
  | PipelineIteratorComponent
  | PipelineGeneralComponent;

export type PipelineComponentMap = Record<string, PipelineComponent>;

export const PipelineComponentMapSchema = z.record(z.any());

export type PipelineRunOnEventItem = {
  type: string;
};

export type PipelineRunOnEventMap = Record<string, PipelineRunOnEventItem>;

export const PipelineRunOnEventItemMapSchema = z.record(z.any());

export const PipelineRunOnMapSchema = z.record(z.any());

export type PipelineRecipe = {
  version: string;
  component?: PipelineComponentMap;
  variable?: PipelineVariableFieldMap;
  output?: PipelineOutputFieldMap;
  on?: PipelineRunOnEventMap;
};

export const PipelineRecipeSchema = z.object({
  version: z.string(),
  component: PipelineComponentMapSchema.optional(),
  variable: PipelineVariableFieldMapSchema.optional(),
  output: PipelineOutputFieldMapSchema.optional(),
  on: PipelineRunOnMapSchema.optional(),
});

export type RunStatus =
  | "RUN_STATUS_PROCESSING"
  | "RUN_STATUS_COMPLETED"
  | "RUN_STATUS_FAILED"
  | "RUN_STATUS_QUEUED";

export type RunSource = "RUN_SOURCE_CONSOLE" | "RUN_SOURCE_API";

export type ResourceView = "VIEW_FULL" | "VIEW_BASIC";

export const ResourceViewSchema = z.enum(["VIEW_FULL", "VIEW_BASIC"]);

export type ResourceViewWithRecipeView = ResourceView | "VIEW_RECIPE";
