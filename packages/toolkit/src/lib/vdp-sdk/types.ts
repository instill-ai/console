/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectorState } from "./connector";
import { ModelState } from "./model";
import { OpenAPIV3 } from "openapi-types";
import { PipelineReleaseState } from "./pipeline";
import { InstillJSONSchema } from "../use-instill-form";

export type ErrorDetails = {
  "@type": string;
  violations?: Violation[];
  description?: string;
};

export type Violation = {
  type: string;
  description: string;
  subject: string;
};

export type ResourceState = ModelState | PipelineReleaseState | ConnectorState;

export type Spec = {
  resource_specification: InstillJSONSchema;
  component_specification: InstillJSONSchema;
  openapi_specifications: Record<string, OpenAPIV3.Document>;
};

export type Visibility =
  | "VISIBILITY_UNSPECIFIED"
  | "VISIBILITY_PRIVATE"
  | "VISIBILITY_PUBLIC";

export type Permission = {
  can_edit: boolean;
  can_trigger: boolean;
};
