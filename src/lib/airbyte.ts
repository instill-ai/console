import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

/**
 * This is the official airbyte schema json type they are using in their web-app
 * ref: https://github.com/airbytehq/airbyte/blob/29ce34f1cee4878a6e9368890d87820c0d379844/airbyte-webapp/src/core/jsonSchema/types.ts
 */

type AirbyteJSONSchemaProps = {
  airbyte_secret?: boolean;
  is_auth?: boolean;
  airbyte_hidden?: boolean;
  multiline?: boolean;
  order?: number;
};

/**
 * Remaps all {@link JSONSchema7} to Airbyte Json schema
 */
export type AirbyteJSONSchema = {
  [Property in keyof JSONSchema7]+?: JSONSchema7[Property] extends boolean
    ? boolean
    : Property extends "properties" | "patternProperties" | "definitions"
    ? Record<string, AirbyteJSONSchemaDefinition>
    : JSONSchema7[Property] extends JSONSchema7Definition
    ? AirbyteJSONSchemaDefinition
    : JSONSchema7[Property] extends JSONSchema7Definition[]
    ? AirbyteJSONSchemaDefinition[]
    : JSONSchema7[Property] extends
        | JSONSchema7Definition
        | JSONSchema7Definition[]
    ? AirbyteJSONSchemaDefinition | AirbyteJSONSchemaDefinition[]
    : JSONSchema7[Property];
} & AirbyteJSONSchemaProps;

export type AirbyteJSONSchemaDefinition = AirbyteJSONSchema | boolean;
