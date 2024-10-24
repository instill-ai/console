import type {
  ComponentDefinition,
  IteratorDefinition,
  Nullable,
  User,
} from "instill-sdk";

import { InstillJSONSchema } from "../use-instill-form";
import { Organization } from "./organization";

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

export type DataSpecification = {
  input: Nullable<InstillJSONSchema>;
  output: Nullable<InstillJSONSchema>;
};

export type Spec = {
  componentSpecification: InstillJSONSchema;
  dataSpecifications: Nullable<Record<string, DataSpecification>>;
};

export type Visibility =
  | "VISIBILITY_UNSPECIFIED"
  | "VISIBILITY_PRIVATE"
  | "VISIBILITY_PUBLIC";

export type Permission = {
  canEdit: boolean;
  canTrigger: boolean;
};

export type StripeSubscriptionDetail = {
  productName: string;
  id: string;
  itemId: string;
  price: number;
  canceledAt?: number;
  trialEnd?: number;
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

export type Definition = ComponentDefinition | IteratorDefinition;
