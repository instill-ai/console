import { AirbyteJsonSchema, SelectedItemMap } from "../types";
import * as yup from "yup";
import { Nullable } from "../../type";
import { JSONSchema7Definition } from "json-schema";

export const transformAirbyteSchemaToYup = (
  jsonSchema: AirbyteJsonSchema,
  selectedItemMap: Nullable<SelectedItemMap>,
  parentSchema?: AirbyteJsonSchema,
  propertyKey?: string,
  propertyPath: string | undefined = propertyKey
): yup.AnySchema => {
  let schema:
    | yup.NumberSchema
    | yup.StringSchema
    | yup.AnyObjectSchema
    | yup.ArraySchema<yup.AnySchema>
    | yup.BooleanSchema
    | null = null;

  if (jsonSchema.oneOf) {
    // Select first oneOf path if no item selected

    console.log(selectedItemMap, propertyPath);

    // Because airbyte schemas are merged into a giant schema, the first layer oneOf
    // (Select the desired Destination tyoe) doesn't have the key path.
    // The selectedMap will looks like
    /*
      {
        "": {
          "selectedItem": "Postgres"
        }
      }
    */

    let selectedSchema: JSONSchema7Definition | undefined;

    if (selectedItemMap && !propertyPath && selectedItemMap[""]) {
      selectedSchema = selectedItemMap
        ? jsonSchema.oneOf.find(
            (condition) =>
              typeof condition !== "boolean" &&
              condition.title === selectedItemMap[""]?.selectedItem
          )
        : jsonSchema.oneOf[0];
    } else {
      selectedSchema =
        selectedItemMap && propertyPath
          ? jsonSchema.oneOf.find(
              (condition) =>
                typeof condition !== "boolean" &&
                condition.title === selectedItemMap[propertyPath]?.selectedItem
            )
          : jsonSchema.oneOf[0];
    }

    if (selectedSchema && typeof selectedSchema !== "boolean") {
      return transformAirbyteSchemaToYup(
        { type: jsonSchema.type, ...selectedSchema },
        selectedItemMap,
        jsonSchema,
        propertyKey,
        propertyPath
      );
    }
  }

  switch (jsonSchema.type) {
    case "array": {
      if (
        typeof jsonSchema.items === "object" &&
        !Array.isArray(jsonSchema.items)
      ) {
        schema = yup
          .array()
          .of(
            transformAirbyteSchemaToYup(
              jsonSchema.items,
              selectedItemMap,
              jsonSchema,
              propertyKey,
              propertyPath
            )
          );
      }
      break;
    }
    case "object": {
      let objectSchema = yup.object();

      const keyEntries = Object.entries(jsonSchema.properties || {}).map(
        ([propertyKey, condition]) => [
          propertyKey,
          typeof condition !== "boolean"
            ? transformAirbyteSchemaToYup(
                condition,
                selectedItemMap,
                jsonSchema,
                propertyKey,
                propertyPath ? `${propertyPath}.${propertyKey}` : propertyKey
              )
            : yup.mixed(),
        ]
      );

      if (keyEntries.length) {
        objectSchema = objectSchema.shape(Object.fromEntries(keyEntries));
      } else {
        objectSchema = objectSchema.default({});
      }

      schema = objectSchema;
      break;
    }
    case "string": {
      schema = yup.string();

      if (jsonSchema?.pattern !== undefined) {
        schema = schema.matches(
          new RegExp(jsonSchema.pattern),
          "form.pattern.error"
        );
      }
      break;
    }
    case "boolean": {
      schema = yup.boolean();
      break;
    }
    case "integer": {
      schema = yup.number();

      if (jsonSchema?.minimum !== undefined) {
        schema = schema.min(jsonSchema?.minimum);
      }

      if (jsonSchema?.maximum !== undefined) {
        schema = schema.max(jsonSchema?.maximum);
      }
      break;
    }
  }

  const isRequired =
    parentSchema &&
    Array.isArray(parentSchema?.required) &&
    parentSchema.required.find((item) => item === propertyKey);

  if (schema && isRequired) {
    schema = schema.required();
  }

  return schema || yup.mixed();
};
