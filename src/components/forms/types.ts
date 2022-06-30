import { AirbyteJsonSchema } from "@/lib/airbyte";
import type { JSONSchema7TypeName, JSONSchema7Type } from "json-schema";

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

type AirbyteFormConditionItem = {
  _type: "formCondition";
  conditions: Record<string, AirbyteFormGroupItem | AirbyteFormBaseField>;
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

export type {
  AirbyteFormTree,
  AirbyteFormConditionItem,
  AirbyteFormGroupItem,
  AirbyteFormObjectArrayItem,
};
