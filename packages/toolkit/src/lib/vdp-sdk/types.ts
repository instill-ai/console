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

export type StripeSubscriptionDetail = {
  product_name: string;
  id: string;
  item_id: string;
  price: number;
  canceled_at?: number;
  trial_end?: number;
  status: StripeSubscriptionStatus;
};

export type StripeSubscriptionStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_INCOMPLETE"
  | "STATUS_INCOMPLETE_EXPIRED"
  | "STATUS_TRIALING"
  | "STATUS_ACTIVE"
  | "STATUS_PAST_DUE"
  | "STATUS_CANCELED"
  | "STATUS_UNPAID"
  | "STATUS_PAUSED";
