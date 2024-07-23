/**
 * We use these types in both pipeline and release client, to avoid circular
 * dependency issue, we need to put the type and schema here
 */

import { Nullable } from "vitest";
import { z } from "zod";

import { DataSpecification, GeneralRecord } from "../types";
import { ConnectorDefinition, OperatorDefinition } from "./component";

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

export type PipelineVariableFieldMap = Record<string, PipelineVariableField>;

export const PipelineVariableFieldMapSchema = z.record(
  PipelineVariableFieldSchema,
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

export type PipelineOutputFieldMap = Record<string, PipelineOutputField>;

export const PipelineOutputFieldMapSchema = z.record(PipelineOutputFieldSchema);

export type ComponentBasicFields = {
  metadata?: GeneralRecord;
  type: string;
};

export type PipelineGeneralComponent = {
  definition?: Nullable<ConnectorDefinition | OperatorDefinition>;
  task: string;
  input: GeneralRecord;
  condition: Nullable<string>;
  setup: Nullable<GeneralRecord>;
} & ComponentBasicFields;

export type PipelineIteratorComponent = {
  input: string;
  outputElements: Record<string, string>;
  component: PipelineComponentMap;
  condition: Nullable<string>;
  dataSpecification: Nullable<DataSpecification>;
} & ComponentBasicFields;

export type PipelineComponent =
  | PipelineIteratorComponent
  | PipelineGeneralComponent;

export type PipelineComponentMap = Record<string, PipelineComponent>;

export const PipelineComponentMapSchema = z.record(z.any());

export type PipelineRecipe = {
  version: string;
  component?: PipelineComponentMap;
  variable?: PipelineVariableFieldMap;
  output?: PipelineOutputFieldMap;
};

export const PipelineRecipeSchema = z.object({
  version: z.string(),
  component: PipelineComponentMapSchema.optional(),
  variable: PipelineVariableFieldMapSchema.optional(),
  output: PipelineOutputFieldMapSchema.optional(),
});
