/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { Organization } from "./core/organization";
import { User } from "./core/user";

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

export type Nullable<T> = T | null;

export type GeneralRecord = Record<string, any>;

export type Owner = UserOwner | OrganizationOwner;

export type InstillCredentialMap = {
  targets: string[];
  values: string[];
};
export type InstillCustomProps = {
  instillUpstreamType?: string;
  instillUpstreamTypes?: string[];
  instillFormat?: string;
  instillAcceptFormats?: string[];
  instillShortDescription?: string;
  instillUIOrder?: number;
  instillUIMultiline?: boolean;
  instillEditOnNodeFields?: string[];
  instillSecret?: boolean;
  instillPatternErrorMessage?: string;
  instillCredentialMap?: InstillCredentialMap;
  instillCredential?: boolean;
  instillModelPromptImageBase64ObjectFormat?: boolean;
};

export type InstillJSONSchemaDefinition = InstillJSONSchema | boolean;

type InstillJsonSchemaProps = {
  example?: string | number;
  "x-oaiTypeLabel"?: string;
  "x-go-type"?: string;
  nullable?: boolean;
} & InstillCustomProps;

export type InstillJSONSchema = {
  [Property in keyof JSONSchema7]+?: JSONSchema7[Property] extends boolean
    ? boolean
    : Property extends "enum"
      ? string[]
      : Property extends "if" | "then"
        ? InstillJSONSchema
        : Property extends "allOf"
          ? InstillJSONSchema[] | undefined
          : Property extends "oneOf"
            ? InstillJSONSchema[] | undefined
            : Property extends "anyOf"
              ? InstillJSONSchema[] | undefined
              : Property extends
                    | "properties"
                    | "patternProperties"
                    | "definitions"
                ? Record<string, InstillJSONSchema>
                : Property extends "items"
                  ? InstillJSONSchema
                  : JSONSchema7[Property] extends
                        | JSONSchema7Definition
                        | JSONSchema7Definition[]
                    ?
                        | InstillJSONSchemaDefinition
                        | InstillJSONSchemaDefinition[]
                    : JSONSchema7[Property] extends InstillJSONSchema
                      ? InstillJSONSchema
                      : JSONSchema7[Property] extends InstillJSONSchema[]
                        ? InstillJSONSchema[]
                        : JSONSchema7[Property] extends
                              | InstillJSONSchema
                              | InstillJSONSchema[]
                          ? InstillJSONSchema | InstillJSONSchema[]
                          : JSONSchema7[Property];
} & InstillJsonSchemaProps;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
