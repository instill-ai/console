/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { z } from "zod";

import { User, UserSchema } from "./mgmt/user";

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

export const PermissionSchema = z.object({
  canEdit: z.boolean(),
  canTrigger: z.boolean(),
});

export type UserOwner = {
  user: User;
};

export const UserOwnerSchema = z.object({
  user: UserSchema,
});

// NOTE: Organization-related types have been moved to EE (console-ee).
// OrganizationOwner type is no longer available in CE.

export type Nullable<T> = T | null;

export type WithNullableFields<T extends object> = {
  [P in keyof T]-?: T[P] | null;
};

export type GeneralRecord = Record<string, any>;

// In CE, Owner is just UserOwner (organizations are EE-only)
export type Owner = UserOwner;

export const OwnerSchema = UserOwnerSchema;

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

export type Operation = {
  name: string;
  response?: {
    "@type": string;
    request: {
      name: string;
      taskInputs: GeneralRecord[];
      version: string;
    };
    response: {
      task: string;
      taskOutputs: GeneralRecord[];
    };
  };
  metadata?: GeneralRecord;
  error?: GeneralRecord;
  done: boolean;
};

export type DataSpecification = {
  input: Nullable<InstillJSONSchema>;
  output: Nullable<InstillJSONSchema>;
};

export type EventSpecification = {
  title: string;
  configSchema: Nullable<InstillJSONSchema>;
  description: string;
  messageExamples: GeneralRecord[];
  messageSchema: Nullable<InstillJSONSchema>;
};

export const DataSpecificationSchema = z.object({
  input: z.any().nullable(),
  output: z.any().nullable(),
});

export type Spec = {
  componentSpecification: InstillJSONSchema;
  dataSpecifications: Nullable<Record<string, DataSpecification>>;
  eventSpecifications: Nullable<Record<string, EventSpecification>>;
};

export const SpecSchema = z.object({
  componentSpecification: z.record(z.any()),
  dataSpecifications: z
    .record(
      z.object({
        input: z.any().nullable(),
        output: z.any().nullable(),
      }),
    )
    .nullable(),
});

export class InstillError extends Error {
  response?: InstillErrorResponse;
  status: number;

  constructor(
    message: string,
    status: number,
    response?: InstillErrorResponse,
  ) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

export type InstillErrorResponse = {
  code: number;
  message: string;
  details: ErrorDetails[];
};

export type FileReference = {
  name: string;
  type: string;
  size: number;
  url: string;
};
