/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModelState } from "./model";
import { PipelineReleaseState } from "./pipeline";
import { InstillJSONSchema } from "../use-instill-form";
import { User } from "./mgmt";
import { Organization } from "./organization";
import { Nullable } from "../type";

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

export type ResourceState = ModelState | PipelineReleaseState;

export type DataSpecification = {
  input: Nullable<InstillJSONSchema>;
  output: Nullable<InstillJSONSchema>;
};

export type Spec = {
  resource_specification: InstillJSONSchema;
  component_specification: InstillJSONSchema;
  data_specifications: Nullable<Record<string, DataSpecification>>;
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
  description: string;
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

export type UserOwner = {
  user: User;
};

export type OrganizationOwner = {
  organization: Organization;
};

export type Owner = UserOwner | OrganizationOwner;
