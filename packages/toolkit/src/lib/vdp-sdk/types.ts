/* eslint-disable @typescript-eslint/no-explicit-any */

import { JSONSchema7 } from "json-schema";
import { ConnectorResourceState } from "./connector";
import { ModelState } from "./model";
import { OpenAPIV3 } from "openapi-types";
import { PipelineReleaseState } from "./pipeline";

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

export type ResourceState =
  | ModelState
  | PipelineReleaseState
  | ConnectorResourceState;

export type Spec = {
  resource_specification: JSONSchema7;
  component_specification: JSONSchema7;
  openapi_specifications: Record<string, OpenAPIV3.Document>;
};

export type Visibility =
  | "VISIBILITY_UNSPECIFIED"
  | "VISIBILITY_PRIVATE"
  | "VISIBILITY_PUBLIC";
