import * as z from "zod";
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import { Nullable } from "../type";

export type InstillCustomProps = {
  instillUpstreamType?: string;
  instillUpstreamTypes?: string[];
  instillFormat?: string;
  instillAcceptFormats?: string[];
  instillShortDescription?: string;
  instillUIOrder?: number;
  instillUiMultiline?: boolean;
  instillEditOnNodeFields?: string[];
  instillCredentialField?: boolean;
  instillPatternErrorMessage?: string;
};

type InstillJsonSchemaProps = {
  example?: string | number;
  "x-oaiTypeLabel"?: string;
  nullable?: boolean;
} & InstillCustomProps;

// This type is especially for jsonSchema OneOf properties
// {"key.subkey.credential": "oauth" }
export type SelectedConditionMap = Record<string, string>;

export type InstillJSONSchemaDefinition = InstillJSONSchema | boolean;

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
    : Property extends "properties" | "patternProperties" | "definitions"
    ? Record<string, InstillJSONSchema>
    : Property extends "items"
    ? InstillJSONSchema
    : JSONSchema7[Property] extends
        | JSONSchema7Definition
        | JSONSchema7Definition[]
    ? InstillJSONSchemaDefinition | InstillJSONSchemaDefinition[]
    : JSONSchema7[Property] extends InstillJSONSchema
    ? InstillJSONSchema
    : JSONSchema7[Property] extends InstillJSONSchema[]
    ? InstillJSONSchema[]
    : JSONSchema7[Property] extends InstillJSONSchema | InstillJSONSchema[]
    ? InstillJSONSchema | InstillJSONSchema[]
    : JSONSchema7[Property];
} & InstillJsonSchemaProps;

export type instillZodSchema = z.ZodTypeAny;

type InstillFormBaseFields = {
  fieldKey: null | string;
  path: null | string;
  isRequired: boolean;
  title?: string;
  description?: string;
  isMultiline?: boolean;
  isHidden?: boolean;
} & InstillCustomProps;

export type InstillFormItem = {
  _type: "formItem";
  type: JSONSchema7TypeName;
} & InstillFormBaseFields &
  InstillJSONSchema;

export type InstillFormGroupItem = {
  _type: "formGroup";
  jsonSchema: InstillJSONSchema;
  properties: InstillFormTree[];
} & InstillFormBaseFields;

export type InstillFormConditionItem = {
  _type: "formCondition";
  conditions: Record<string, InstillFormGroupItem>;
  jsonSchema: InstillJSONSchema;
} & InstillFormBaseFields;

export type InstillObjectArrayItem = {
  _type: "objectArray";
  properties: InstillFormTree;
  jsonSchema: InstillJSONSchema;
} & InstillFormBaseFields;

export type InstillFormTree =
  | InstillFormItem
  | InstillFormGroupItem
  | InstillFormConditionItem
  | InstillObjectArrayItem;

export type CheckIsHidden = (props: {
  parentSchema: Nullable<InstillJSONSchema>;
  targetSchema: Nullable<InstillJSONSchema>;
  targetKey: Nullable<string>;
}) => boolean;

export type SmartHintWarning = {
  message?: string;
  notAvailableReferences: string[];
  notAvailableTemplates: string[];
};
