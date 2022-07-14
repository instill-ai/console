import { Nullable } from "@/types/general";
import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
  JSONSchema7Type,
} from "json-schema";
import { ReactNode } from "react";

/**
 * This is the official airbyte schema json type they are using in their web-app
 * ref: https://github.com/airbytehq/airbyte/blob/29ce34f1cee4878a6e9368890d87820c0d379844/airbyte-webapp/src/core/jsonSchema/types.ts
 */

type AirbyteJsonSchemaProps = {
  airbyte_secret?: boolean;
  is_auth?: boolean;
  airbyte_hidden?: boolean;
  multiline?: boolean;
  order?: number;
};

type AirbyteJsonSchemaDefinition = AirbyteJsonSchema | boolean;

/**
 * Remaps all {@link JSONSchema7} to Airbyte Json schema
 */
type AirbyteJsonSchema = {
  [Property in keyof JSONSchema7]+?: JSONSchema7[Property] extends boolean
    ? boolean
    : Property extends "properties" | "patternProperties" | "definitions"
    ? Record<string, AirbyteJsonSchemaDefinition>
    : JSONSchema7[Property] extends JSONSchema7Definition
    ? AirbyteJsonSchemaDefinition
    : JSONSchema7[Property] extends JSONSchema7Definition[]
    ? AirbyteJsonSchemaDefinition[]
    : JSONSchema7[Property] extends
        | JSONSchema7Definition
        | JSONSchema7Definition[]
    ? AirbyteJsonSchemaDefinition | AirbyteJsonSchemaDefinition[]
    : JSONSchema7[Property];
} & AirbyteJsonSchemaProps;

type AirbyteFormBaseField = {
  fieldKey: string;
  path: string;
  isRequired: boolean;
  order?: number;
  title?: string;
  description?: string;
  airbyte_hidden?: boolean;
};

type AirbyteFormItem = {
  _type: "formItem";
  type: JSONSchema7TypeName;
  isSecret?: boolean;
  multiline?: boolean;
} & AirbyteFormBaseField &
  AirbyteJsonSchema;

type AirbyteFormGroupItem = {
  _type: "formGroup";
  jsonSchema: AirbyteJsonSchema;
  properties: AirbyteFormTree[];
  isLoading?: boolean;
  hasOauth?: boolean;
  default?: JSONSchema7Type;
  examples?: JSONSchema7Type;
} & AirbyteFormBaseField;

type AirbyteCondition = Record<string, AirbyteFormGroupItem>;

type AirbyteConditionWithUiField = Record<
  string,
  AirbyteFormGroupItem & { uiField: ReactNode }
>;

type AirbyteFormConditionItem = {
  _type: "formCondition";
  conditions: AirbyteCondition;
} & AirbyteFormBaseField;

type AirbyteFormConditionItemWithUiFields = {
  _type: "formCondition";
  conditions: AirbyteConditionWithUiField;
} & AirbyteFormBaseField;

type AirbyteFormObjectArrayItem = {
  _type: "objectArray";
  properties: AirbyteFormTree;
} & AirbyteFormBaseField;

type AirbyteFormTree =
  | AirbyteFormGroupItem
  | AirbyteFormItem
  | AirbyteFormConditionItem
  | AirbyteFormObjectArrayItem;

type AirbyteFieldValues = {
  [k: string]: string | number | boolean | null | AirbyteFieldValues;
};

type AirbyteFieldErrors = Record<string, string | null>;

export type {
  AirbyteFormTree,
  AirbyteFormBaseField,
  AirbyteFormConditionItem,
  AirbyteFormConditionItemWithUiFields,
  AirbyteFormGroupItem,
  AirbyteFormItem,
  AirbyteFormObjectArrayItem,
  AirbyteJsonSchemaDefinition,
  AirbyteJsonSchema,
  AirbyteFieldValues,
  AirbyteFieldErrors,
  AirbyteCondition,
  AirbyteConditionWithUiField,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// This type is especially for jsonSchema OneOf properties
// {"key.subkey.credential": { selectedItem: "oauth" }}
export type SelectedItem = {
  selectedItem: Nullable<string>;
};
export type SelectedItemMap = Record<string, SelectedItem>;
