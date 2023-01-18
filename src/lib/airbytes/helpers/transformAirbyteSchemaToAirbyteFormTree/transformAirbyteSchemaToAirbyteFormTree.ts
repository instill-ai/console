/**
 * This is based on the airbyte implementation
 * ref: https://github.com/airbytehq/airbyte/blob/29ce34f1cee4878a6e9368890d87820c0d379844/airbyte-webapp/src/core/jsonSchema/schemaToUiWidget.ts
 */

import type {
  AirbyteJsonSchema,
  AirbyteJsonSchemaDefinition,
  AirbyteFormTree,
} from "../../types";

export const transformAirbyteSchemaToAirbyteFormTree = (
  jsonSchema: AirbyteJsonSchemaDefinition,
  key = "",
  path: string = key,
  parent?: AirbyteJsonSchema
): AirbyteFormTree => {
  const isRequired = isKeyRequired(key, parent);

  if (typeof jsonSchema === "boolean") {
    return {
      _type: "formItem",
      path: key,
      fieldKey: key,
      type: "null",
      isRequired,
      isSecret: false,
    };
  }

  if (jsonSchema.oneOf?.length && jsonSchema.oneOf.length > 0) {
    const conditions = Object.fromEntries(
      jsonSchema.oneOf.map((condition) => {
        if (typeof condition === "boolean") {
          return [];
        }
        return [
          condition.title,
          transformAirbyteSchemaToAirbyteFormTree(
            { ...condition, type: jsonSchema.type },
            key,
            path
          ),
        ];
      })
    );

    return {
      ...pickDefaultFields(jsonSchema),
      _type: "formCondition",
      path: path || key,
      fieldKey: key,
      conditions,
      isRequired,
    };
  }

  if (
    jsonSchema.type === "array" &&
    typeof jsonSchema.items === "object" &&
    !Array.isArray(jsonSchema.items) &&
    jsonSchema.items.type === "object"
  ) {
    return {
      ...pickDefaultFields(jsonSchema),
      _type: "objectArray",
      path: path || key,
      fieldKey: key,
      properties: transformAirbyteSchemaToAirbyteFormTree(
        jsonSchema.items,
        key,
        path
      ),
      isRequired,
    };
  }

  if (jsonSchema.type === "object") {
    // We sort the order of the items here, the item withour order field will be sorted to
    // the bottom of the array

    const properties = Object.entries(jsonSchema.properties || [])
      .map(([k, schema]) =>
        transformAirbyteSchemaToAirbyteFormTree(
          schema,
          k,
          path ? `${path}.${k}` : k,
          jsonSchema
        )
      )
      .sort((a, b) => {
        if (typeof a.order === "undefined") {
          return 1;
        }

        if (typeof b.order === "undefined") {
          return -1;
        }
        return a.order > b.order ? 1 : -1;
      });

    return {
      ...pickDefaultFields(jsonSchema),
      _type: "formGroup",
      jsonSchema,
      path: path || key,
      fieldKey: key,
      hasOauth: jsonSchema.is_auth,
      properties,
      isRequired,
    };
  }

  return {
    ...pickDefaultFields(jsonSchema),
    _type: "formItem",
    path: path || key,
    fieldKey: key,
    isRequired,
    isSecret: !!jsonSchema.airbyte_secret,
    multiline: !!jsonSchema.multiline,
    type:
      (Array.isArray(jsonSchema.type) ? jsonSchema.type[0] : jsonSchema.type) ??
      "null",
  };
};

const isKeyRequired = (
  key: string,
  parentSchema?: AirbyteJsonSchemaDefinition
): boolean => {
  const isRequired =
    (typeof parentSchema !== "boolean" &&
      Array.isArray(parentSchema?.required) &&
      parentSchema?.required.includes(key)) ||
    false;

  return isRequired;
};

const defaultFields: Array<keyof AirbyteJsonSchema> = [
  "default",
  "examples",
  "description",
  "pattern",
  "order",
  "const",
  "title",

  // airbyte specific fields
  "airbyte_hidden",
];

const pickDefaultFields = (
  schema: AirbyteJsonSchema
): Partial<AirbyteJsonSchema> => {
  const partialSchema: Partial<AirbyteJsonSchema> = {
    ...Object.fromEntries(
      Object.entries(schema).filter(([k]) =>
        defaultFields.includes(k as keyof AirbyteJsonSchema)
      )
    ),
  };

  if (
    typeof schema.items === "object" &&
    !Array.isArray(schema.items) &&
    schema.items.enum
  ) {
    partialSchema.enum = schema.items.enum;
  } else if (schema.enum) {
    if (schema.enum?.length === 1 && isDefined(schema.default)) {
      partialSchema.const = schema.default;
    } else {
      partialSchema.enum = schema.enum;
    }
  }

  return partialSchema;
};

function isDefined<T>(
  a: T | null | undefined
): a is Exclude<T, null | undefined> {
  return a !== undefined && a !== null;
}
