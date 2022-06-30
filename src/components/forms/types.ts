import { AirbyteJSONSchema } from "@/lib/airbyte";
import type { JSONSchema7TypeName, JSONSchema7Type } from "json-schema";

type FormBaseField = {
  fieldKey: string;
  path: string;
  isRequired: boolean;
  order?: number;
  title?: string;
  description?: string;
  airbyte_hidden?: boolean;
};

type FormItem = {
  _type: "formItem";
  type: JSONSchema7TypeName;
  isSecret?: boolean;
  multiline?: boolean;
} & FormBaseField &
  AirbyteJSONSchema;

type FormGroupItem = {
  _type: "formGroup";
  jsonSchema: AirbyteJSONSchema;
  properties: FormTree[];
  isLoading?: boolean;
  hasOauth?: boolean;
  default?: JSONSchema7Type;
  examples?: JSONSchema7Type;
} & FormBaseField;

type FormConditionItem = {
  _type: "formCondition";
  conditions: Record<string, FormGroupItem | FormBaseField>;
} & FormBaseField;

type FormObjectArrayItem = {
  _type: "objectArray";
  properties: FormTree;
} & FormBaseField;

type FormTree =
  | FormGroupItem
  | FormItem
  | FormConditionItem
  | FormObjectArrayItem;

export type { FormTree, FormConditionItem, FormGroupItem, FormObjectArrayItem };
